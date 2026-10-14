import { useState } from 'react'
import { useToast } from '../lib/toast'

const ROWS = [
  { id: '1', title: '视频剪辑管线', agent: 'Claude Code', meta: '今天 · $0.42' },
  { id: '2', title: 'ReachFlow 选择器', agent: 'Codex', meta: '今天 · $0.11' },
  { id: '3', title: '配音草稿', agent: 'WorkBuddy', meta: '昨天 · 本地' },
]

export function SessionsView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(ROWS)
  return (
    <div className="page">
      <div className="page-head">
        <h1>会话</h1>
        <p>历史与花费</p>
      </div>
      <div className="card">
        {rows.map((r) => (
          <div key={r.id} className="row">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 560 }}>{r.title}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{r.agent} · {r.meta}</div>
            </div>
            <button type="button" className="btn ghost" onClick={() => toast('打开')}>打开</button>
            <button type="button" className="btn ghost" onClick={() => { setRows((xs) => xs.filter((x) => x.id !== r.id)); toast('已删') }}>删除</button>
          </div>
        ))}
      </div>
    </div>
  )
}
