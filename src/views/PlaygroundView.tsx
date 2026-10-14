import { useState } from 'react'
import { COMPOSITE_OPTIONS } from '../lib/types'
import { useToast } from '../lib/toast'

type Mode = 'chat' | 'tts' | 'asr'

export function PlaygroundView() {
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>('chat')
  const [target, setTarget] = useState(COMPOSITE_OPTIONS[3]!)
  const [text, setText] = useState('你好，这是 PackGate 本地试跑。')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const run = () => {
    setRunning(true)
    setResult(null)
    toast(`试跑 · ${mode} · ${target}`)
    setTimeout(() => {
      if (mode === 'chat') {
        setResult(
          `假回复（Demo）\n目标：${target}\n输入长度：${text.length}\n\n「收到。本地网关会把请求转到所选模型/Pack。」`,
        )
      } else if (mode === 'tts') {
        setResult(
          `TTS 假结果\nPack：${target}\n文本：${text.slice(0, 40)}${text.length > 40 ? '…' : ''}\n输出：/tmp/packgate-demo-tts.wav（未真实生成）\n耗时：~820 ms`,
        )
      } else {
        setResult(
          `ASR 假结果\nPack：${target}\n输入：demo-audio.wav\n转写：「${text || '这是识别出的假字幕。'}」\n置信度：0.92`,
        )
      }
      setRunning(false)
    }, 800)
  }

  return (
    <div className="content">
      <div
        className="list-card"
        style={{
          padding: '12px 14px',
          marginBottom: 12,
          background: 'var(--action-soft)',
          borderColor: 'transparent',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 13 }}>本地试跑台</div>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
          类似 LocalAI Playground · 不连真后端，点运行出假结果。
        </div>
      </div>

      <div className="list-card" style={{ marginBottom: 12 }}>
        <div className="list-row">
          <span style={{ flex: 1, fontWeight: 560 }}>能力</span>
          <div className="seg">
            {(
              [
                ['chat', '文本'],
                ['tts', 'TTS'],
                ['asr', 'ASR'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                data-on={mode === id}
                onClick={() => {
                  setMode(id)
                  setResult(null)
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="list-row">
          <span style={{ width: 72, color: 'var(--fg-3)' }}>目标</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={{
              flex: 1,
              border: '1px solid var(--border)',
              background: 'var(--bg-subtle)',
              borderRadius: 8,
              font: 'inherit',
              fontSize: 12.5,
              padding: '6px 8px',
              color: 'var(--fg-1)',
            }}
          >
            {COMPOSITE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div style={{ padding: '10px 14px 14px' }}>
          <div className="muted" style={{ fontSize: 11.5, marginBottom: 6 }}>
            {mode === 'asr' ? '参考转写 / 说明' : mode === 'tts' ? '待合成文本' : '提示词'}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 10,
              font: 'inherit',
              fontSize: 13,
              background: 'var(--bg-subtle)',
              color: 'var(--fg-1)',
              resize: 'vertical',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              type="button"
              className="btn primary"
              disabled={running}
              onClick={run}
              style={{ opacity: running ? 0.6 : 1 }}
            >
              {running ? '运行中…' : '运行'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="list-card" style={{ padding: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 8 }}>结果</div>
          <pre
            className="mono"
            style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontSize: 12,
              lineHeight: 1.55,
              color: 'var(--fg-2)',
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
