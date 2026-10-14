import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { COMPOSITE_OPTIONS } from '../lib/types'
import { useToast } from '../lib/toast'

type Msg = { id: string; role: 'user' | 'assistant' | 'system'; text: string }

const FAKE_REPLIES = [
  '好的。我会走当前选中的组合模型；需要本地 Pack（如 TTS / ASR）时由网关按需加载。',
  '（Demo）已规划步骤：1) 理解意图 2) 路由到目标 3) 返回结果。正式版会流式输出。',
  '可以用「本地试跑」页单独验证 TTS / ASR；对话里则通过组合模型一并调度。',
]

export function PiChatView() {
  const { toast } = useToast()
  const [model, setModel] = useState(COMPOSITE_OPTIONS[0]!)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: '0',
      role: 'system',
      text: '内置 Pi Agent · Demo。发送消息会得到假回复；目标可选组合模型或 Pack。',
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, busy])

  const send = () => {
    const text = input.trim()
    if (!text || busy) return
    const user: Msg = { id: String(Date.now()), role: 'user', text }
    setMsgs((m) => [...m, user])
    setInput('')
    setBusy(true)
    toast(`经 ${model}`)
    setTimeout(() => {
      const reply =
        FAKE_REPLIES[Math.floor(Math.random() * FAKE_REPLIES.length)]! +
        `\n\n— 目标：${model}`
      setMsgs((m) => [
        ...m,
        { id: String(Date.now() + 1), role: 'assistant', text: reply },
      ])
      setBusy(false)
    }, 700)
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderBottom: '0.5px solid var(--border)',
          }}
        >
          <span className="muted" style={{ fontSize: 12 }}>目标</span>
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value)
              toast(e.target.value)
            }}
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg-subtle)',
              borderRadius: 8,
              font: 'inherit',
              fontSize: 12.5,
              padding: '5px 8px',
              color: 'var(--fg-1)',
              maxWidth: 260,
            }}
          >
            {COMPOSITE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <span className="muted" style={{ fontSize: 11.5, marginLeft: 'auto' }}>
            Pi · 内置 Agent
          </span>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px' }}>
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: 12,
                display: 'flex',
                justifyContent:
                  m.role === 'user' ? 'flex-end' : 'flex-start',
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
                  color:
                    m.role === 'user' ? 'var(--bg-app)' : 'var(--fg-1)',
                }}
              >
                {m.role !== 'user' && (
                  <div
                    className="muted"
                    style={{ fontSize: 10.5, marginBottom: 4, fontWeight: 600 }}
                  >
                    {m.role === 'system' ? '系统' : 'Pi'}
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="muted" style={{ fontSize: 12 }}>Pi 正在想…</div>
          )}
          <div ref={endRef} />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '10px 12px',
            borderTop: '0.5px solid var(--border)',
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="跟 Pi 说点什么…"
            style={{
              flex: 1,
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
          <button
            type="button"
            className="btn primary"
            disabled={busy || !input.trim()}
            onClick={send}
            style={{ opacity: busy || !input.trim() ? 0.5 : 1 }}
          >
            <Send style={{ width: 14, height: 14 }} />
            发送
          </button>
        </div>
      </div>
    </div>
  )
}
