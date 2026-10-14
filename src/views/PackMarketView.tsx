import { useState } from 'react'
import { useToast } from '../lib/toast'

const PACKS = [
  { id: 'video', name: '视频多模态', desc: 'ASR · TTS · 字幕对齐 · FFmpeg · Remotion', size: '1.2 GB', state: '已安装' as const },
  { id: 'reach', name: 'ReachFlow 爬取', desc: '网页抓取与选择器库', size: '48 MB', state: '已安装' as const },
  { id: 'tts', name: '本地 TTS', desc: '离线文本转语音', size: '320 MB', state: '可安装' as const },
  { id: 'asr', name: '本地 ASR', desc: '离线语音识别', size: '410 MB', state: '可安装' as const },
  { id: 'img', name: '本地生图', desc: '按需加载 · sidecar', size: '2.4 GB', state: '可安装' as const },
]

export function PackMarketView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(PACKS)
  const installed = rows.filter((r) => r.state === '已安装').length

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
          装好即可作为路由目标，与云模型并列。已安装 {installed} / {rows.length}
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
            <button
              type="button"
              className={p.state === '已安装' ? 'btn' : 'btn primary'}
              onClick={() => {
                if (p.state === '已安装') toast(`${p.name} · 已在路由目标`)
                else {
                  setRows((xs) =>
                    xs.map((x) => (x.id === p.id ? { ...x, state: '已安装' } : x)),
                  )
                  toast(`已安装 ${p.name}`)
                }
              }}
            >
              {p.state === '已安装' ? '管理' : '安装'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
