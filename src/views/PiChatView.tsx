import { useEffect, useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'
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
  const inputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div
      className="content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingBottom: 12,
        boxSizing: 'border-box',
      }}
      onClick={() => setSlashOpen(false)}
    >
      <div
        className="list-card"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px' }}>
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: 12,
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '78%',
                  padding: '8px 12px',
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  background:
                    m.role === 'user'
                      ? 'var(--fg-1)'
                      : m.role === 'system'
                        ? 'var(--action-soft)'
                        : 'var(--bg-subtle)',
                  color: m.role === 'user' ? 'var(--bg-app)' : 'var(--fg-1)',
                }}
              >
                {m.role !== 'user' && (
                  <div
                    className="muted"
                    style={{ fontSize: 10.5, marginBottom: 4, fontWeight: 600 }}
                  >
                    {m.role === 'system' ? '系统' : '助手'}
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="muted" style={{ fontSize: 12 }}>
              正在回复…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div
          style={{
            position: 'relative',
            padding: '10px 12px',
            borderTop: '0.5px solid var(--border)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {slashOpen && filtered.length > 0 && (
            <div
              className="list-card"
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                bottom: '100%',
                marginBottom: 6,
                maxHeight: 220,
                overflow: 'auto',
                zIndex: 20,
                boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
              }}
            >
              <div
                className="muted"
                style={{ padding: '8px 12px 4px', fontSize: 11 }}
              >
                命令 · Pack
              </div>
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className="list-row"
                  style={{
                    width: '100%',
                    border: 0,
                    background: i === slashIdx ? 'var(--action-soft)' : 'transparent',
                    cursor: 'default',
                    textAlign: 'left',
                  }}
                  onMouseEnter={() => setSlashIdx(i)}
                  onClick={() => pickCmd(c)}
                >
                  <span
                    className="mono"
                    style={{
                      width: 64,
                      color: 'var(--action)',
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {c.cmd}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 560, fontSize: 12.5 }}>{c.name}</div>
                    <div className="muted" style={{ fontSize: 11 }}>
                      {c.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
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
                  if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey && input.match(/^\/\S*$/))) {
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
              placeholder="自然语言，或 / 调用 Pack…"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 12px',
                font: 'inherit',
                fontSize: 13,
                background: 'var(--bg-subtle)',
                color: 'var(--fg-1)',
                outline: 'none',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value)
                  toast(e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label="组合模型或 Pack"
                title="组合模型 / Pack"
                style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 320,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-subtle)',
                  borderRadius: 8,
                  font: 'inherit',
                  fontSize: 12.5,
                  padding: '7px 10px',
                  color: 'var(--fg-1)',
                }}
              >
                {!COMPOSITE_OPTIONS.includes(model) && (
                  <option value={model}>{model}</option>
                )}
                {COMPOSITE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="muted" style={{ fontSize: 11.5, marginRight: 'auto' }}>
                / Pack
              </span>
              <button
                type="button"
                className="btn primary"
                disabled={busy || !input.trim()}
                onClick={() => send()}
                style={{ opacity: busy || !input.trim() ? 0.5 : 1, flex: 'none' }}
              >
                <Send style={{ width: 14, height: 14 }} />
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
