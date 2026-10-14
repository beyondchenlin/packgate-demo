import { useToast } from '../lib/toast'

const ROWS = [
  ['视频剪辑 SOP', '说明'],
  ['ReachFlow 选择器', '片段'],
  ['字幕规范', '规范'],
]

export function LibraryView() {
  const { toast } = useToast()
  return (
    <div className="content">
      <div className="toolbar" style={{padding:0,marginBottom:10}}>
        <div className="spacer" />
        <button type="button" className="btn primary" onClick={() => toast('新建')}>新建</button>
      </div>
      <div className="list-card">
        {ROWS.map(([name, kind]) => (
          <div key={name} className="list-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{kind}</div>
            </div>
            <button type="button" className="btn ghost" onClick={() => toast('打开')}>打开</button>
          </div>
        ))}
      </div>
    </div>
  )
}
