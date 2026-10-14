import { useState } from 'react'
import { useToast } from '../lib/toast'

const SEED = [
  {
    id: '1',
    name: '视频多模态',
    desc: '入口 LLM + ASR / TTS / 剪辑 / Remotion',
    packs: ['视频多模态'],
    prefer: 'Agent 自带额度优先',
  },
  {
    id: '2',
    name: '爬取研究',
    desc: 'ReachFlow + 长上下文模型',
    packs: ['ReachFlow'],
    prefer: '云模型',
  },
  {
    id: '3',
    name: '省钱编码',
    desc: 'DeepSeek 优先 · 自带额度兜底',
    packs: [],
    prefer: 'Agent 自带额度优先',
  },
]

export function CompositeView() {
  const { toast } = useToast()
  const [rows] = useState(SEED)

  return (
    <div className="content">
      <div
        className="list-card"
        style={{
          padding: '14px 16px',
          marginBottom: 12,
          background: 'var(--action-soft)',
          borderColor: 'transparent',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 13 }}>一个入口，背后是云 + 本地 Pack</div>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>
          Agent 只选这一个「组合模型」；无后台 LLM 时优先走入口自带额度。
        </div>
      </div>

      <div className="list-card">
        {rows.map((r) => (
          <div key={r.id} className="list-row">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'var(--fg-1)',
                color: 'var(--bg-app)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                flex: 'none',
              }}
            >
              C
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 560 }}>{r.name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                {r.desc}
              </div>
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    color: 'var(--fg-2)',
                    background: 'var(--bg-subtle)',
                    padding: '1px 6px',
                    borderRadius: 99,
                  }}
                >
                  {r.prefer}
                </span>
                {r.packs.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: 10.5,
                      color: 'var(--action)',
                      background: 'var(--action-soft)',
                      padding: '1px 6px',
                      borderRadius: 99,
                      fontWeight: 560,
                    }}
                  >
                    Pack · {p}
                  </span>
                ))}
              </div>
            </div>
            <button type="button" className="btn ghost" onClick={() => toast(`编辑 ${r.name}`)}>
              编辑
            </button>
            <button type="button" className="btn" onClick={() => toast(`已选用 ${r.name}`)}>
              使用
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
