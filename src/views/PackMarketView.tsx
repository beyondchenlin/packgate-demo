import { useState } from 'react'
import { useToast } from '../lib/toast'

const PACKS = [
  { id: 'video', name: '视频多模态', desc: 'ASR · TTS · 字幕对齐 · FFmpeg · Remotion', size: '1.2 GB', state: '已安装' },
  { id: 'reach', name: 'ReachFlow 爬取', desc: '网页抓取与选择器库', size: '48 MB', state: '已安装' },
  { id: 'tts', name: '本地 TTS', desc: '离线文本转语音', size: '320 MB', state: '可安装' },
  { id: 'asr', name: '本地 ASR', desc: '离线语音识别', size: '410 MB', state: '可安装' },
  { id: 'img', name: '本地生图', desc: '按需加载 · sidecar', size: '2.4 GB', state: '可安装' },
]

export function PackMarketView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(PACKS)
  return (
    <div className="content">
      <div className="list-card">
        {rows.map((p) => (
          <div key={p.id} className="list-row">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 560 }}>{p.name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                {p.desc} · {p.size}
              </div>
            </div>
            <button
              type="button"
              className={p.state === '已安装' ? 'btn' : 'btn primary'}
              onClick={() => {
                if (p.state === '已安装') {
                  toast(`${p.name} · 已在路由目标里`)
                } else {
                  setRows((xs) => xs.map((x) => (x.id === p.id ? { ...x, state: '已安装' } : x)))
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
