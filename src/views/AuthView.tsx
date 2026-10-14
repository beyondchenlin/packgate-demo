import { useToast } from '../lib/toast'

const ROWS = [
  ['GitHub Copilot', '已登录'],
  ['ChatGPT', '需重新登录'],
  ['xAI · Grok', '未登录'],
]

export function AuthView() {
  const { toast } = useToast()
  return (
    <div className="content">
      <div className="list-card">
        {ROWS.map(([name, st]) => (
          <div key={name} className="list-row">
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
