import { useState } from 'react'
import { useToast } from '../lib/toast'

export function AppsView() {
  const { toast } = useToast()
  const [rows, setRows] = useState([
    { id: '1', name: 'Claude Code', ver: '2.1.4', vis: true },
    { id: '2', name: 'Codex', ver: '0.48.0', vis: true },
    { id: '3', name: 'WorkBuddy', ver: '1.0.2', vis: true },
    { id: '4', name: 'OpenCode', ver: '未安装', vis: false },
  ])
  return (
    <div className="content">
      <div className="toolbar" style={{padding:0,marginBottom:10}}>
        <div className="spacer" />
        <button type="button" className="btn" onClick={() => toast('全部升级')}>全部升级</button>
      </div>
      <div className="list-card">
        {rows.map((a) => (
          <div key={a.id} className="list-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{a.name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{a.ver}</div>
            </div>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setRows((xs) => xs.map((x) => (x.id === a.id ? { ...x, vis: !x.vis } : x)))
                toast(a.vis ? '已隐藏' : '已显示')
              }}
            >
              {a.vis ? '显示中' : '已隐藏'}
            </button>
            <button type="button" className="btn" onClick={() => toast(a.ver === '未安装' ? '安装' : '升级')}>
              {a.ver === '未安装' ? '安装' : '升级'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
