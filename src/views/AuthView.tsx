import { useToast } from '../lib/toast'

const ROWS = [
  ['GitHub Copilot', '已登录'],
  ['ChatGPT', '需重新登录'],
  ['xAI · Grok', '未登录'],
]

export function AuthView() {
  const { toast } = useToast()
  return (
    <div className="page">
      <div className="page-head">
        <h1>授权中心</h1>
        <p>订阅当作供应商使用</p>
      </div>
      <div className="card">
        {ROWS.map(([name, st]) => (
          <div key={name} className="row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{st}</div>
            </div>
            <button type="button" className="btn" onClick={() => toast('登录')}>登录</button>
          </div>
        ))}
      </div>
    </div>
  )
}
