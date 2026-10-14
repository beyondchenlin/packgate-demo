import { useState } from 'react'
import { AGENTS, STRATEGIES, type AgentId, type StrategyId } from '../lib/types'
import { useToast } from '../lib/toast'

const DEST = [
  { id: 'ds', name: 'DeepSeek', model: 'deepseek-v3', on: true },
  { id: 'glm', name: '智谱 GLM', model: 'glm-4.6', on: false },
  { id: 'tts', name: '本地 TTS', model: 'pack/tts', on: false },
  { id: 'asr', name: '本地 ASR', model: 'pack/asr', on: false },
  { id: 'kimi', name: 'Kimi', model: 'kimi-k2', on: false },
]

export function RoutingView({ agent }: { agent: AgentId }) {
  const { toast } = useToast()
  const [strategy, setStrategy] = useState<StrategyId>('smart')
  const [sel, setSel] = useState('ds')
  return (
    <div className="content">
      <div className="toolbar" style={{ padding: 0, marginBottom: 12 }}>
        <div className="seg">
          {STRATEGIES.slice(0, 4).map((s) => (
            <button
              key={s.id}
              type="button"
              data-on={strategy === s.id}
              onClick={() => {
                setStrategy(s.id)
                toast(s.label)
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="hint">
          {STRATEGIES.find((s) => s.id === strategy)?.helper}
        </span>
      </div>

      <div className="list-card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: 16 }}>
          <div>
            <div className="muted" style={{ fontSize: 11, marginBottom: 8 }}>Agents</div>
            {AGENTS.filter((a) => a.installed).slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="list-row"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  marginBottom: 6,
                  minHeight: 40,
                  background: a.id === agent ? 'var(--bg-subtle)' : undefined,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 99, background: a.color }} />
                <span style={{ fontSize: 12.5 }}>{a.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontWeight: 650, fontSize: 13 }}>PackGate</div>
            <div className="muted mono" style={{ marginTop: 2 }}>127.0.0.1:3425</div>
            <span className="chip" style={{ marginTop: 10, background: 'var(--fg-1)', color: 'var(--bg-app)', padding: '2px 8px', borderRadius: 99, fontSize: 11 }}>
              {STRATEGIES.find((s) => s.id === strategy)?.label}
            </span>
          </div>
          <div>
            <div className="muted" style={{ fontSize: 11, marginBottom: 8 }}>目标</div>
            {DEST.map((d) => (
              <button
                key={d.id}
                type="button"
                className="list-row"
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  marginBottom: 6,
                  minHeight: 40,
                  background: sel === d.id || d.on ? 'var(--route-soft)' : 'transparent',
                  borderColor: sel === d.id || d.on ? 'var(--route)' : 'var(--border)',
                  cursor: 'default',
                  textAlign: 'left',
                }}
                onClick={() => {
                  setSel(d.id)
                  toast(d.name)
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 560, fontSize: 12.5 }}>{d.name}</div>
                  <div className="mono muted">{d.model}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="list-card">
        <div className="list-row" style={{ fontWeight: 600 }}>路由组</div>
        {[
          ['视频多模态', 'group/video · 按意图'],
          ['Daily coding', 'group/daily · 智能'],
          ['Cheap', 'group/cheap · 按顺序'],
        ].map(([n, s]) => (
          <div key={n} className="list-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{n}</div>
              <div className="muted" style={{ fontSize: 12 }}>{s}</div>
            </div>
            <button type="button" className="btn ghost" onClick={() => toast('编辑')}>编辑</button>
          </div>
        ))}
      </div>
    </div>
  )
}
