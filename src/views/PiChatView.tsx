import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUp, Check, ChevronDown, Paperclip } from 'lucide-react'
import { COMPOSITE_OPTIONS, PACK_COMMANDS } from '../lib/types'
import { useToast } from '../lib/toast'

type Msg = { id: string; role: 'user' | 'assistant' | 'system'; text: string }

const FAKE_REPLIES = [
  '好的。需要本地 Pack 时可以说自然语言，或输入 / 调出命令面板。',
  '（Demo）已理解意图并路由。正式版会流式输出与 tool 跟绑。',
  '已调用所选 Pack/组合模型，结果如下（假数据）。',
]

export function PiChatView() {
  const { toast } = useToast()
  const [model, setModel] = useState(COMPOSITE_OPTIONS[0]!)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [focused, setFocused] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashFilter, setSlashFilter] = useState('')
  const [slashIdx, setSlashIdx] = useState(0)
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: '0',
      role: 'system',
      text: '用自然语言对话，或输入 / 调用 Pack（如 /tts、/asr、/crawl）。',
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const modelRef = useRef<HTMLDivElement>(null)

  const hasUserMsgs = msgs.some((m) => m.role === 'user')

  const modelOptions = useMemo(() => {
    const base = [...COMPOSITE_OPTIONS]
    if (model && !base.includes(model)) base.unshift(model)
    return base
  }, [model])

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
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [input])

  useEffect(() => {
    if (!modelOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!modelRef.current?.contains(e.target as Node)) setModelOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [modelOpen])

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

  const send = (override?: string) => {
    const text = (override ?? input).trim()
    if (!text || busy) return
    setSlashOpen(false)
    setModelOpen(false)
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
      className="composer-wrap"
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

      <div className={`composer-card${focused ? ' is-focus' : ''}`}>
        <textarea
          ref={inputRef}
          className="composer-input"
          value={input}
          rows={1}
          placeholder="发消息，或输入 / 调用 Pack…"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
                setSlashIdx((i) => (i - 1 + filtered.length) % filtered.length)
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
              e.preventDefault()
              send()
            }
          }}
        />

        <div className="composer-toolbar">
          <div className="composer-left" ref={modelRef}>
            <button
              type="button"
              className="composer-icon-btn"
              title="添加附件（Demo）"
              onClick={() => toast('附件上传（Demo）')}
            >
              <Paperclip size={15} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              className={`model-pill${modelOpen ? ' open' : ''}`}
              onClick={() => setModelOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={modelOpen}
              title="组合模型 / Pack"
            >
              <span className="model-pill-dot" />
              <span className="model-pill-label">{model}</span>
              <ChevronDown size={13} strokeWidth={2} />
            </button>

            {modelOpen && (
              <div className="model-menu" role="listbox">
                <div className="model-menu-head">组合模型 / Pack</div>
                {modelOptions.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={`model-menu-item${o === model ? ' on' : ''}`}
                    onClick={() => {
                      setModel(o)
                      setModelOpen(false)
                      toast(o)
                      inputRef.current?.focus()
                    }}
                  >
                    <span>{o}</span>
                    {o === model && <Check size={14} strokeWidth={2.2} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="composer-right">
            <button
              type="button"
              className={`send-btn${canSend ? ' ready' : ''}`}
              disabled={!canSend}
              onClick={() => send()}
              aria-label="发送"
            >
              <ArrowUp size={16} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      <div className="composer-foot">
        Enter 发送 · Shift+Enter 换行 · / 调 Pack
      </div>
    </div>
  )

  return (
    <div
      className="chat-view"
      onClick={() => {
        setSlashOpen(false)
        setModelOpen(false)
      }}
    >
      {!hasUserMsgs ? (
        <div className="chat-empty">
          <div className="chat-empty-inner">
            <h2 className="chat-greeting">
              <span className="chat-sparkle">✦</span>
              有什么可以帮你的？
            </h2>
            <p className="chat-greeting-sub">
              自然语言调用 Pack，或输入 / 打开命令面板
            </p>
            {msgs
              .filter((m) => m.role === 'system')
              .map((m) => (
                <div key={m.id} className="chat-bubble role-system chat-empty-hint">
                  <div className="chat-bubble-role">系统</div>
                  {m.text}
                </div>
              ))}
            {composer}
          </div>
        </div>
      ) : (
        <>
          <div className="chat-msgs">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble-row ${m.role === 'user' ? 'is-user' : ''}`}
              >
                <div className={`chat-bubble role-${m.role}`}>
                  {m.role !== 'user' && (
                    <div className="chat-bubble-role">
                      {m.role === 'system' ? '系统' : '助手'}
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
            {busy && <div className="chat-typing">正在回复…</div>}
            <div ref={endRef} />
          </div>
          {composer}
        </>
      )}
    </div>
  )
}
