import { APPS, type AgentId } from '../lib/types'
import { useToast } from '../lib/toast'

export function AppsView({
  activeId,
  onOpen,
}: {
  activeId: AgentId
  onOpen: (id: AgentId) => void
}) {
  const { toast } = useToast()
  return (
    <div className="content">
      <p className="muted" style={{ margin: '0 0 12px', fontSize: 12.5 }}>
        应用列表已从侧栏收纳到此。点选进入对应供应商与路由配置。
      </p>
      <div className="list-card">
        {APPS.map((a) => (
          <button
            key={a.id}
            type="button"
            className="list-row"
            style={{
              width: '100%',
              border: 0,
              background: a.id === activeId ? 'var(--action-soft)' : 'transparent',
              cursor: 'default',
              textAlign: 'left',
            }}
            onClick={() => onOpen(a.id)}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                background: a.color,
                flex: 'none',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 560 }}>{a.label}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                供应商 · MCP · Skills
              </div>
            </div>
            {a.id === activeId && (
              <span className="muted" style={{ fontSize: 11.5 }}>
                当前
              </span>
            )}
            <span className="btn ghost" style={{ pointerEvents: 'none' }}>
              打开
            </span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          className="btn"
          onClick={() => toast('安装应用（Demo）')}
        >
          安装应用
        </button>
      </div>
    </div>
  )
}
