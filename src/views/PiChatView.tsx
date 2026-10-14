import { useEffect, useMemo, useRef, useState } from 'react'
import { COMPOSITE_OPTIONS, PACK_COMMANDS } from '../lib/types'
import { useToast } from '../lib/toast'

type Msg = { id: string; role: 'user' | 'assistant'; text: string }

const FAKE_REPLIES = [
  '好的。需要本地 Pack 时可以说自然语言，或输入 / 调出命令面板。',
  '（Demo）已理解意图并路由。正式版会流式输出与 tool 跟绑。',
  '已调用所选 Pack/组合模型，结果如下（假数据）。',
]

/**
 * PackGate built-in chat — layout parity with VerticalCraft/agent-ui
 * ClaudeDefaultSurface + FirstSendComposer / ClaudeComposer.
 */
export function PiChatView() {
  const { toast } = useToast()
  const [model, setModel] = useState(COMPOSITE_OPTIONS[0]!)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashFilter, setSlashFilter] = useState('')
  const [slashIdx, setSlashIdx] = useState(0)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const isEmpty = msgs.length === 0

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
  }, [msgs, busy])

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 44), 220)}px`
  }, [input])

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
    setModel(`Pack · ${cmd.name}`)
    toast(`已选 ${cmd.cmd}`)
    inputRef.current?.focus()
  }

  const send = () => {
    const text = input.trim()
    if (!text || busy) return
    setSlashOpen(false)
    const user: Msg = { id: String(Date.now()), role: 'user', text }
    setMsgs((m) => [...m, user])
    setInput('')
    setBusy(true)

    const hit = PACK_COMMANDS.find((c) => text.startsWith(c.cmd))
    const target = hit ? `Pack · ${hit.name}` : model
    toast(`经 ${target}`)

    setTimeout(() => {
      let reply: string
      if (hit) {
        reply =
          `已调用 ${hit.cmd}（${hit.name}）\n` +
          `参数：${text.slice(hit.cmd.length).trim() || '（无）'}\n\n` +
          `假结果：Pack「${hit.name}」执行完成 · ~0.8s`
      } else {
        reply =
          FAKE_REPLIES[Math.floor(Math.random() * FAKE_REPLIES.length)]! +
          `\n\n— 目标：${target}`
      }
      setMsgs((m) => [
        ...m,
        { id: String(Date.now() + 1), role: 'assistant', text: reply },
      ])
      setBusy(false)
    }, 650)
  }

  const canSend = !!input.trim() && !busy

  const composer = (
    <div
      className="claude-composer first-send-composer"
      data-testid="packgate-composer"
      onClick={(e) => e.stopPropagation()}
    >
      {slashOpen && filtered.length > 0 && (
        <div className="slash-pop" role="listbox">
          <div className="slash-pop-head">命令 · Pack</div>
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
          isEmpty ? '今天想一起做什么？' : '发消息，或输入 / 调用 Pack…'
        }
        aria-label="对话"
        disabled={busy}
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
            send()
          }
        }}
      />

      {/* agent-ui FirstSendComposer toolbar: ＋ | model | spacer | ↑ */}
      <div className="claude-composer-toolbar first-send-inline-models">
        <button
          type="button"
          className="claude-icon-button"
          aria-label="添加图片"
          title="添加图片（Demo）"
          onClick={() => toast('附件上传（Demo）')}
        >
          ＋
        </button>

        <select
          aria-label="首次发送模型"
          className="claude-model-picker"
          value={model}
          disabled={busy}
          onChange={(e) => {
            setModel(e.target.value)
            toast(e.target.value)
            inputRef.current?.focus()
          }}
        >
          {COMPOSITE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          {!COMPOSITE_OPTIONS.includes(model) && (
            <option value={model}>{model}</option>
          )}
        </select>

        <span className="claude-composer-spacer" />

        {busy ? (
          <button
            type="button"
            className="claude-primary-action"
            aria-label="停止"
            onClick={() => {
              setBusy(false)
              toast('已停止（Demo）')
            }}
          >
            ■
          </button>
        ) : (
          <button
            type="button"
            className={`claude-primary-action${canSend ? '' : ' claude-primary-action-disabled'}`}
            aria-label="发送"
            disabled={!canSend}
            onClick={send}
          >
            ↑
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div
      className="claude-thread-root"
      onClick={() => setSlashOpen(false)}
    >
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
            {msgs.map((m) =>
              m.role === 'user' ? (
                <div
                  key={m.id}
                  className="claude-message claude-message-user"
                >
                  <div className="claude-user-message-wrap">
                    <div className="claude-user-bubble">{m.text}</div>
                  </div>
                </div>
              ) : (
                <div
                  key={m.id}
                  className="claude-message claude-message-assistant"
                >
                  <div className="claude-assistant-message">{m.text}</div>
                </div>
              ),
            )}
            {busy && (
              <div className="claude-message claude-message-assistant">
                <div className="claude-assistant-message claude-typing">
                  正在回复…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="claude-thread-footer">
            {composer}
            <p className="claude-disclaimer">
              AI 可能会出错，请核对重要结果。输入 / 可调用 Pack。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
