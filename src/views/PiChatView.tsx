import { useEffect, useMemo, useRef, useState } from 'react'
import { COMPOSITE_OPTIONS, PACK_COMMANDS } from '../lib/types'
import { useToast } from '../lib/toast'
import {
  initialSnapshot,
  newSessionId,
  newToolCallId,
  queueKindForBusySend,
  type ChatMessage,
  type QueueItem,
  type SessionSnapshot,
} from '../lib/sessionRuntime'

const FAKE_REPLIES = [
  '好的。需要本地 Pack 时可以说自然语言，或输入 / 调出命令面板。',
  '（Demo）宿主已接受 prompt。正式版由 SessionDaemon 流式投影 tool / partial。',
  '已按会话绑定模型路由；本地 Pack 走网关，不另起第二执行器。',
]

/**
 * PackGate「对话」— UI 对标 VerticalCraft/agent-ui ClaudeDefaultSurface；
 * 状态对标 agent-web SessionDaemon：
 *   first-send 建 Session → prompt / followUp 队列 → toolCallId 卡片 → abort≠stop
 */
export function PiChatView() {
  const { toast } = useToast()
  const [snap, setSnap] = useState<SessionSnapshot>(() =>
    initialSnapshot(COMPOSITE_OPTIONS[0]!),
  )
  const [input, setInput] = useState('')
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashFilter, setSlashFilter] = useState('')
  const [slashIdx, setSlashIdx] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const abortRef = useRef(false)

  const isEmpty = snap.messages.length === 0 && snap.phase === 'idle'
  const isBusy =
    snap.phase === 'running' ||
    snap.phase === 'creating' ||
    snap.phase === 'aborting'

  const filtered = useMemo(() => {
    const q = slashFilter.toLowerCase()
    return PACK_COMMANDS.filter(
      (c) =>
        !q ||
        c.cmd.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.desc.includes(q),
    )
  }, [slashFilter])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [snap.messages, snap.queue, snap.phase, snap.hostUi])

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 44), 220)}px`
  }, [input])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  const later = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
    return t
  }

  const parseSlash = (value: string) => {
    if (!value.startsWith('/')) {
      setSlashOpen(false)
      setSlashFilter('')
      return
    }
    const token = value.slice(1).split(/\s/)[0] ?? ''
    setSlashOpen(true)
    setSlashFilter(token)
    setSlashIdx(0)
  }

  const pickCmd = (cmd: (typeof PACK_COMMANDS)[number]) => {
    setInput(cmd.cmd + ' ')
    setSlashOpen(false)
    setSnap((s) => ({ ...s, model: `Pack · ${cmd.name}` }))
    toast(`已选 ${cmd.cmd}`)
    inputRef.current?.focus()
  }

  const patchMessages = (
    updater: (msgs: ChatMessage[]) => ChatMessage[],
  ) => {
    setSnap((s) => ({ ...s, messages: updater(s.messages) }))
  }

  const upsertTool = (
    toolCallId: string,
    patch: Partial<Extract<ChatMessage, { kind: 'tool' }>> & {
      name?: string
      detail?: string
    },
  ) => {
    patchMessages((msgs) => {
      const i = msgs.findIndex(
        (m) => m.kind === 'tool' && m.toolCallId === toolCallId,
      )
      if (i < 0) {
        return [
          ...msgs,
          {
            id: toolCallId,
            kind: 'tool' as const,
            toolCallId,
            name: patch.name ?? 'tool',
            cmd: patch.cmd,
            phase: patch.phase ?? 'running',
            detail: patch.detail ?? '',
          },
        ]
      }
      const cur = msgs[i] as Extract<ChatMessage, { kind: 'tool' }>
      const next = [...msgs]
      next[i] = { ...cur, ...patch }
      return next
    })
  }

  /** Drain one followUp after current run ends (agent-web queue semantics). */
  const drainQueue = () => {
    setSnap((s) => {
      if (s.queue.length === 0) {
        return { ...s, phase: 'idle' }
      }
      const [head, ...rest] = s.queue
      // schedule outside setState
      later(30, () => runPrompt(head!.text, s.model, s.sessionId!, false))
      return { ...s, queue: rest, phase: 'running' }
    })
  }

  const runPrompt = (
    text: string,
    model: string,
    sessionId: string,
    isFirst: boolean,
  ) => {
    abortRef.current = false
    setSnap((s) => ({
      ...s,
      sessionId,
      model,
      phase: isFirst ? 'creating' : 'running',
    }))

    const hit = PACK_COMMANDS.find((c) => text.startsWith(c.cmd))

    const afterCreate = () => {
      if (abortRef.current) return
      setSnap((s) => ({ ...s, phase: 'running' }))

      if (hit) {
        // Pack → tool card with stable toolCallId (agent-web tool.update/end)
        const toolCallId = newToolCallId()
        upsertTool(toolCallId, {
          name: hit.name,
          cmd: hit.cmd,
          phase: 'running',
          detail: `调用 ${hit.cmd} · 经网关 Pack…`,
        })
        later(400, () => {
          if (abortRef.current) {
            upsertTool(toolCallId, {
              phase: 'aborted',
              detail: '已 abort（运行取消，会话保留）',
            })
            drainQueue()
            return
          }
          upsertTool(toolCallId, {
            phase: 'update',
            detail: `参数：${text.slice(hit.cmd.length).trim() || '（无）'}`,
          })
        })
        later(900, () => {
          if (abortRef.current) {
            upsertTool(toolCallId, {
              phase: 'aborted',
              detail: '已 abort（运行取消，会话保留）',
            })
            drainQueue()
            return
          }
          upsertTool(toolCallId, {
            phase: 'end',
            detail: `Pack「${hit.name}」完成 · ~0.8s · session ${sessionId.slice(0, 12)}…`,
          })
          patchMessages((msgs) => [
            ...msgs,
            {
              id: `a_${Date.now()}`,
              kind: 'assistant',
              text: `工具 ${hit.cmd} 已结束。结果已写入会话转录（Demo）。`,
            },
          ])
          drainQueue()
        })
        return
      }

      // Ordinary assistant turn with partial → final (transcript-snapshot style)
      const aid = `a_${Date.now()}`
      patchMessages((msgs) => [
        ...msgs,
        {
          id: aid,
          kind: 'assistant',
          text: '…',
          partial: true,
        },
      ])
      later(350, () => {
        if (abortRef.current) {
          patchMessages((msgs) =>
            msgs.map((m) =>
              m.id === aid
                ? {
                    ...m,
                    kind: 'assistant' as const,
                    text: '（已 abort）',
                    partial: false,
                  }
                : m,
            ),
          )
          drainQueue()
          return
        }
        const reply =
          FAKE_REPLIES[Math.floor(Math.random() * FAKE_REPLIES.length)]! +
          `\n\n— 模型：${model} · session ${sessionId.slice(0, 12)}…`
        patchMessages((msgs) =>
          msgs.map((m) =>
            m.id === aid
              ? { ...m, kind: 'assistant' as const, text: reply, partial: false }
              : m,
          ),
        )
        drainQueue()
      })
    }

    later(isFirst ? 280 : 40, afterCreate)
  }

  const askConfirmPack = (text: string, model: string): Promise<boolean> =>
    new Promise((resolve) => {
      const hit = PACK_COMMANDS.find((c) => text.startsWith(c.cmd))
      if (!hit) {
        resolve(true)
        return
      }
      setSnap((s) => ({
        ...s,
        hostUi: {
          id: `ask_${Date.now()}`,
          kind: 'confirm',
          title: `允许 Pack：${hit.name}`,
          message: `将调用 ${hit.cmd}（经 PackGate 网关）。等同 agent-web host UI confirm。`,
          resolve: (ok) => {
            setSnap((cur) => ({ ...cur, hostUi: null }))
            resolve(ok)
          },
        },
      }))
      void model
    })

  const submit = async () => {
    const text = input.trim()
    if (!text || snap.phase === 'aborting' || snap.hostUi) return
    setSlashOpen(false)

    // Busy → enqueue followUp (do NOT append to confirmed history yet)
    if (snap.phase === 'running' || snap.phase === 'creating') {
      const item: QueueItem = {
        id: `q_${Date.now()}`,
        kind: queueKindForBusySend(),
        text,
      }
      setSnap((s) => ({ ...s, queue: [...s.queue, item] }))
      setInput('')
      toast(`已入队 followUp（${snap.queue.length + 1}）`)
      return
    }

    const ok = await askConfirmPack(text, snap.model)
    if (!ok) {
      toast('已拒绝 Pack 调用')
      return
    }

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      kind: 'user',
      text,
    }
    setInput('')

    const isFirst = !snap.sessionId
    const sessionId = snap.sessionId ?? newSessionId()
    if (isFirst) toast(`Session 已创建 ${sessionId.slice(0, 14)}…`)

    setSnap((s) => ({
      ...s,
      sessionId,
      messages: [...s.messages, userMsg],
      phase: isFirst ? 'creating' : 'running',
    }))

    runPrompt(text, snap.model, sessionId, isFirst)
  }

  /** Chat Stop → abort current run; session stays alive (agent-web /abort ≠ /stop) */
  const abortRun = () => {
    if (!isBusy) return
    abortRef.current = true
    setSnap((s) => ({ ...s, phase: 'aborting', queue: [] }))
    toast('abort：取消当前运行，会话保留')
    later(200, () => {
      setSnap((s) => ({ ...s, phase: s.sessionId ? 'idle' : 'idle' }))
    })
  }

  const clearQueueRestore = () => {
    setSnap((s) => {
      if (s.queue.length === 0) return s
      const restored = s.queue.map((q) => q.text).join('\n')
      setInput((cur) => (cur ? `${cur}\n${restored}` : restored))
      toast(`已清空队列并还原 ${s.queue.length} 条`)
      return { ...s, queue: [] }
    })
  }

  const canSend = !!input.trim() && snap.phase !== 'aborting' && !snap.hostUi

  const statusLabel = (() => {
    if (!snap.sessionId) return '未建会话 · 首条消息将创建 Session'
    if (snap.phase === 'creating') return '创建 Session…'
    if (snap.phase === 'running') return '执行中'
    if (snap.phase === 'aborting') return 'abort 中…'
    if (snap.queue.length) return `空闲 · 队列 ${snap.queue.length}`
    return '空闲'
  })()

  const composer = (
    <div
      className="claude-composer first-send-composer"
      data-testid="packgate-composer"
      onClick={(e) => e.stopPropagation()}
    >
      {slashOpen && filtered.length > 0 && (
        <div className="slash-pop" role="listbox">
          <div className="slash-pop-head">命令 · Pack（→ tool call）</div>
          {filtered.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`slash-item${i === slashIdx ? ' on' : ''}`}
              onMouseEnter={() => setSlashIdx(i)}
              onClick={() => pickCmd(c)}
            >
              <span className="slash-cmd">{c.cmd}</span>
              <span className="slash-meta">
                <span className="slash-name">{c.name}</span>
                <span className="slash-desc">{c.desc}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <textarea
        ref={inputRef}
        className="claude-composer-input"
        value={input}
        rows={1}
        placeholder={
          isEmpty
            ? '今天想一起做什么？'
            : isBusy
              ? '执行中继续发送会进入 followUp 队列…'
              : '发消息，或输入 / 调用 Pack…'
        }
        aria-label="对话"
        disabled={snap.phase === 'aborting' || !!snap.hostUi}
        onChange={(e) => {
          const v = e.target.value
          setInput(v)
          parseSlash(v)
        }}
        onKeyDown={(e) => {
          if (slashOpen && filtered.length > 0) {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setSlashIdx((i) => (i + 1) % filtered.length)
              return
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setSlashIdx(
                (i) => (i - 1 + filtered.length) % filtered.length,
              )
              return
            }
            if (
              e.key === 'Tab' ||
              (e.key === 'Enter' && !e.shiftKey && input.match(/^\/\S*$/))
            ) {
              e.preventDefault()
              pickCmd(filtered[slashIdx]!)
              return
            }
            if (e.key === 'Escape') {
              setSlashOpen(false)
              return
            }
          }
          if (e.key === 'Enter' && !e.shiftKey) {
            if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229)
              return
            e.preventDefault()
            void submit()
          }
        }}
      />

      <div className="claude-composer-toolbar first-send-inline-models">
        <button
          type="button"
          className="claude-icon-button"
          aria-label="添加图片"
          title="添加图片（Demo）"
          onClick={() => toast('附件上传（Demo）· 正式版走 /attachments')}
        >
          ＋
        </button>

        <select
          aria-label="会话模型"
          className="claude-model-picker"
          value={snap.model}
          disabled={isBusy}
          onChange={(e) => {
            setSnap((s) => ({ ...s, model: e.target.value }))
            toast(
              snap.sessionId
                ? `会话模型 → ${e.target.value}（Demo：POST /model）`
                : e.target.value,
            )
            inputRef.current?.focus()
          }}
        >
          {COMPOSITE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          {!COMPOSITE_OPTIONS.includes(snap.model) && (
            <option value={snap.model}>{snap.model}</option>
          )}
        </select>

        <span className="claude-composer-spacer" />

        {isBusy ? (
          <button
            type="button"
            className="claude-primary-action"
            aria-label="停止"
            title="abort 当前运行（≠ 关闭 Session）"
            onClick={abortRun}
          >
            ■
          </button>
        ) : (
          <button
            type="button"
            className={`claude-primary-action${canSend ? '' : ' claude-primary-action-disabled'}`}
            aria-label="发送"
            disabled={!canSend}
            onClick={() => void submit()}
          >
            ↑
          </button>
        )}
      </div>
    </div>
  )

  const queuePanel =
    snap.queue.length > 0 ? (
      <div className="pg-queue-panel">
        <div className="pg-queue-title">
          <span>
            队列 · {snap.queue.length}
            <small>（followUp / steer 分列，未写入已确认历史）</small>
          </span>
          <button type="button" onClick={clearQueueRestore}>
            清空并还原到输入框
          </button>
        </div>
        {snap.queue.map((q) => (
          <div key={q.id} className="pg-queue-item">
            <span className="pg-queue-kind">{q.kind}</span>
            <span>{q.text}</span>
          </div>
        ))}
      </div>
    ) : null

  const hostUiCard = snap.hostUi ? (
    <div className="pg-host-ui" role="dialog" aria-modal="true">
      <strong>{snap.hostUi.title}</strong>
      <p>{snap.hostUi.message}</p>
      <div className="pg-host-ui-actions">
        <button type="button" onClick={() => snap.hostUi?.resolve(false)}>
          拒绝
        </button>
        <button
          type="button"
          className="pg-host-ui-allow"
          onClick={() => snap.hostUi?.resolve(true)}
        >
          允许
        </button>
      </div>
    </div>
  ) : null

  const renderMsg = (m: ChatMessage) => {
    if (m.kind === 'user') {
      return (
        <div key={m.id} className="claude-message claude-message-user">
          <div className="claude-user-message-wrap">
            <div className="claude-user-bubble">{m.text}</div>
          </div>
        </div>
      )
    }
    if (m.kind === 'tool') {
      return (
        <div key={m.id} className="claude-message">
          <div className={`pg-tool-card phase-${m.phase}`}>
            <div className="pg-tool-head">
              <span className="pg-tool-name">
                {m.cmd ?? m.name}
                <em>{m.name}</em>
              </span>
              <span className="pg-tool-phase">{m.phase}</span>
            </div>
            <div className="pg-tool-id">toolCallId · {m.toolCallId}</div>
            <div className="pg-tool-detail">{m.detail}</div>
          </div>
        </div>
      )
    }
    return (
      <div key={m.id} className="claude-message claude-message-assistant">
        <div
          className={`claude-assistant-message${m.partial ? ' is-partial' : ''}`}
        >
          {m.text}
        </div>
      </div>
    )
  }

  return (
    <div
      className="claude-thread-root"
      onClick={() => setSlashOpen(false)}
    >
      <div className="pg-session-bar" title="agent-web: Machine→Project→Workspace→Session">
        <span className="pg-session-dot" data-phase={snap.phase} />
        <span className="pg-session-status">{statusLabel}</span>
        {snap.sessionId && (
          <code className="pg-session-id">{snap.sessionId}</code>
        )}
        <span className="pg-session-target">
          {snap.target.machineId}/{snap.target.workspaceId}
        </span>
      </div>

      {isEmpty ? (
        <div className="claude-empty-state">
          <div className="claude-empty-inner">
            <h1 className="claude-greeting">
              <span className="claude-sparkle">✦</span>
              <span>今天想一起做什么？</span>
            </h1>
            {composer}
          </div>
        </div>
      ) : (
        <div className="claude-thread-viewport">
          <div className="claude-chat-content">
            {snap.messages.map(renderMsg)}
            <div ref={endRef} />
          </div>

          <div className="claude-thread-footer">
            {hostUiCard}
            {queuePanel}
            {composer}
            <p className="claude-disclaimer">
              AI 可能会出错，请核对重要结果。执行中发送入队；■ = abort（保留
              Session）。/ 调 Pack → 工具卡片。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
