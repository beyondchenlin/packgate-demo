import { useToast } from '../lib/toast'

const ROWS = [
  ['opencode-gemini-auth', '登录插件'],
  ['gateway-redact', '中间件 · 脱敏'],
  ['usage-webhook', '中间件 · 用量'],
]

export function PluginsView() {
  const { toast } = useToast()
  return (
    <div className="page">
      <div className="page-head">
        <h1>插件</h1>
        <p>npm 登录插件与网关中间件</p>
        <button type="button" className="btn primary" onClick={() => toast('添加插件')}>添加</button>
      </div>
      <div className="card">
        {ROWS.map(([name, kind]) => (
          <div key={name} className="row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{kind}</div>
            </div>
            <button type="button" className="btn" onClick={() => toast('切换')}>启用</button>
          </div>
        ))}
      </div>
    </div>
  )
}
