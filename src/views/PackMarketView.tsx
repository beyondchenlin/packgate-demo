import { useState } from 'react'
import { useToast } from '../lib/toast'

type Pack = {
  id: string
  name: string
  desc: string
  size: string
  state: '已安装' | '可安装'
  kind: 'tts' | 'asr' | 'chat' | 'crawl' | 'video'
}

const PACKS: Pack[] = [
  { id: 'video', name: '视频多模态', desc: 'ASR · TTS · 字幕对齐 · FFmpeg · Remotion', size: '1.2 GB', state: '已安装', kind: 'video' },
  { id: 'reach', name: 'ReachFlow 爬取', desc: '网页抓取与选择器库', size: '48 MB', state: '已安装', kind: 'crawl' },
  { id: 'tts', name: '本地 TTS', desc: '离线文本转语音', size: '320 MB', state: '可安装', kind: 'tts' },
  { id: 'asr', name: '本地 ASR', desc: '离线语音识别', size: '410 MB', state: '可安装', kind: 'asr' },
  { id: 'img', name: '本地生图', desc: '按需加载 · sidecar', size: '2.4 GB', state: '可安装', kind: 'chat' },
]

export function PackMarketView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(PACKS)
  const [trial, setTrial] = useState<Pack | null>(null)
  const [text, setText] = useState('你好，这是 Pack 试跑。')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const installed = rows.filter((r) => r.state === '已安装').length

  const openTrial = (p: Pack) => {
    setTrial(p)
    setResult(null)
    setText(
      p.kind === 'tts'
        ? '请把这段话合成语音。'
        : p.kind === 'asr'
          ? '（模拟音频）今天天气不错'
          : p.kind === 'crawl'
            ? 'https://example.com'
            : '试跑一下这个 Pack',
    )
    toast(`试跑 · ${p.name}`)
  }

  const run = () => {
    if (!trial) return
    setRunning(true)
    setResult(null)
    setTimeout(() => {
      const lines = [
        `Pack：${trial.name}`,
        `类型：${trial.kind}`,
        `输入：${text.slice(0, 80)}${text.length > 80 ? '…' : ''}`,
        '',
        trial.kind === 'tts'
          ? '输出：/tmp/packgate-tts.wav（Demo 未真实生成）'
          : trial.kind === 'asr'
            ? `转写：「${text}」· 置信度 0.91`
            : trial.kind === 'crawl'
              ? '抓取：标题 Example Domain · 正文 128 字（假）'
              : '假结果：任务已完成 · ~0.9s',
      ]
      setResult(lines.join('\n'))
      setRunning(false)
    }, 750)
  }

  return (
    <div className="content">
      <div
        className="list-card"
        style={{
          padding: '14px 16px',
          marginBottom: 12,
          borderColor: 'transparent',
          background: 'var(--action-soft)',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 13 }}>预制重型本地能力</div>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>
          装好即可作为路由目标。点「使用 / 试跑」打开该 Pack 试跑面板。已安装 {installed} /{' '}
          {rows.length}
        </div>
      </div>

      <div className="list-card">
        {rows.map((p) => (
          <div key={p.id} className="list-row">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: p.state === '已安装' ? 'var(--action)' : 'var(--bg-subtle)',
                color: p.state === '已安装' ? '#fff' : 'var(--fg-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                flex: 'none',
              }}
            >
              P
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 560, display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.name}
                {p.state === '已安装' && (
                  <span
                    style={{
                      fontSize: 10.5,
                      color: 'var(--action)',
                      background: 'var(--action-soft)',
                      padding: '1px 6px',
                      borderRadius: 99,
                      fontWeight: 600,
                    }}
                  >
                    可用
                  </span>
                )}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                {p.desc} · {p.size}
              </div>
            </div>
            {p.state === '已安装' ? (
              <>
                <button type="button" className="btn primary" onClick={() => openTrial(p)}>
                  使用 / 试跑
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => toast(`${p.name} · 管理（Demo）`)}
                >
                  管理
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  setRows((xs) =>
                    xs.map((x) => (x.id === p.id ? { ...x, state: '已安装' } : x)),
                  )
                  toast(`已安装 ${p.name}`)
                }}
              >
                安装
              </button>
            )}
          </div>
        ))}
      </div>

      {trial && (
        <div className="modal-bg" onClick={() => setTrial(null)}>
          <div
            className="modal"
            style={{ width: 'min(440px, 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>试跑 · {trial.name}</h3>
            <p className="muted" style={{ fontSize: 12.5, margin: '0 0 12px' }}>
              {trial.desc}
            </p>
            <label className="field">
              <span>
                {trial.kind === 'tts'
                  ? '待合成文本'
                  : trial.kind === 'asr'
                    ? '参考转写'
                    : trial.kind === 'crawl'
                      ? 'URL'
                      : '输入'}
              </span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 8,
                  font: 'inherit',
                  fontSize: 12.5,
                  background: 'var(--bg-subtle)',
                  color: 'var(--fg-1)',
                  resize: 'vertical',
                }}
              />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn ghost" onClick={() => setTrial(null)}>
                关闭
              </button>
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
            {result && (
              <pre
                className="mono"
                style={{
                  marginTop: 12,
                  padding: 10,
                  background: 'var(--bg-subtle)',
                  borderRadius: 8,
                  whiteSpace: 'pre-wrap',
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: 'var(--fg-2)',
                }}
              >
                {result}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
