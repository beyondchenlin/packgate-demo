import { useState } from 'react'
import { useToast } from '../lib/toast'

const SEED = [
  { id: '1', name: 'filesystem', apps: ['Claude Code', 'Codex'] },
  { id: '2', name: 'browser', apps: ['Claude Code'] },
  { id: '3', name: 'packgate-local', apps: ['Claude Code', 'Codex', 'WorkBuddy'] },
]

export function McpView() {
  const { toast } = useToast()
  const [rows] = useState(SEED)
  return (
    <div className="content">
      <div className="toolbar" style={{padding:0,marginBottom:10}}>
        <div className="spacer" />
        <button type="button" className="btn" onClick={() => toast('导入')}>导入</button>
        <button type="button" className="btn primary" onClick={() => toast('添加')}>添加</button>
      </div>
      <div className="list-card">
        {rows.map((r) => (
          <div key={r.id} className="list-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{r.name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{r.apps.join(' · ')}</div>
            </div>
            <button type="button" className="btn ghost" onClick={() => toast('编辑')}>编辑</button>
          </div>
        ))}
      </div>
    </div>
  )
}
