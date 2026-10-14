import { useState } from 'react'
import { useToast } from '../lib/toast'

const QUOTAS = [
  { name: 'Claude Max', detail: '5 小时窗口', used: 68 },
  { name: 'ChatGPT Plus', detail: '周额度', used: 41 },
  { name: 'DeepSeek', detail: '账户余额', used: 22 },
]

const LOGS = [
  { t: '13:41', agent: 'Claude Code', model: 'glm-4.6', cost: '$0.02' },
  { t: '13:40', agent: 'Codex', model: 'deepseek-v3', cost: '$0.01' },
  { t: '13:38', agent: 'WorkBuddy', model: 'local/tts', cost: '$0.00' },
]

export function UsageView() {
  const { toast } = useToast()
  const [tab, setTab] = useState<'quota' | 'log'>('quota')
  return (
    <div className="content">
      <div className="toolbar" style={{padding:0,marginBottom:10}}>
        <div className="spacer" />
        <div className="seg">
          <button type="button" data-on={tab==='quota'} onClick={() => setTab('quota')}>额度</button>
          <button type="button" data-on={tab==='log'} onClick={() => setTab('log')}>请求</button>
        </div>
        <button type="button" className="btn ghost" onClick={() => toast('已导出 CSV')}>导出</button>
      </div>
      {tab === 'quota' ? (
        <div className="list-card">
          {QUOTAS.map((q) => (
            <div key={q.name} className="list-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 560 }}>{q.name}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{q.detail}</div>
                <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: 'var(--card-2)', overflow: 'hidden', maxWidth: 280 }}>
                  <div style={{ width: `${q.used}%`, height: '100%', background: 'var(--fg)', borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}>{q.used}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-card">
          {LOGS.map((r, i) => (
            <button key={i} type="button" className="list-row" style={{ width: '100%', border: 0, background: 'transparent', cursor: 'default', textAlign: 'left' }} onClick={() => toast(r.model)}>
              <span className="mono muted" style={{ width: 44 }}>{r.t}</span>
              <span style={{ flex: 1 }}>{r.agent} · {r.model}</span>
              <span className="muted">{r.cost}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
