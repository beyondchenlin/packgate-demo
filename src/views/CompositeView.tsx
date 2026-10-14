import { useToast } from '../lib/toast'

const ROWS = [
  ['视频多模态', '云 LLM + ASR/TTS/剪辑/打包'],
  ['爬取研究', 'ReachFlow + 长上下文模型'],
  ['省钱编码', 'DeepSeek 优先 · 自带额度兜底'],
]

export function CompositeView() {
  const { toast } = useToast()
  return (
    <div className="page">
      <div className="page-head">
        <h1>组合模型</h1>
        <p>一个入口，背后是云模型与本地 Pack</p>
        <button type="button" className="btn primary" onClick={() => toast('新建组合')}>新建</button>
      </div>
      <div className="card">
        {ROWS.map(([name, desc]) => (
          <div key={name} className="row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{desc}</div>
            </div>
            <button type="button" className="btn ghost" onClick={() => toast('编辑')}>编辑</button>
          </div>
        ))}
      </div>
    </div>
  )
}
