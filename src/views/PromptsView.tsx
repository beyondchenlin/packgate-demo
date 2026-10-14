import { useState } from 'react'
import { useToast } from '../lib/toast'

export function PromptsView() {
  const { toast } = useToast()
  const [rows, setRows] = useState([
    { id: '1', name: '视频剪辑助手', on: true },
    { id: '2', name: '严苛 Code Review', on: false },
  ])
  return (
    <div className="page">
      <div className="page-head">
        <h1>提示词</h1>
        <p>按工具分别维护</p>
        <button type="button" className="btn primary" onClick={() => toast('新建')}>新建</button>
      </div>
      <div className="card">
        {rows.map((r) => (
          <div key={r.id} className="row">
            <div style={{ flex: 1, fontWeight: 560 }}>{r.name}</div>
            <button
              type="button"
              className="toggle"
              data-on={r.on}
              onClick={() => {
                setRows((xs) => xs.map((x) => (x.id === r.id ? { ...x, on: !x.on } : x)))
                toast(r.on ? '已停用' : '已启用')
              }}
            >
              <i />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
