import { useState } from 'react'
import { useToast } from '../lib/toast'

export function SkillsView() {
  const { toast } = useToast()
  const [tab, setTab] = useState<'in' | 'find'>('in')
  return (
    <div className="page">
      <div className="page-head">
        <h1>Skills</h1>
        <p>安装、发现、同步到各 Agent</p>
        <div className="seg">
          <button type="button" data-on={tab==='in'} onClick={() => setTab('in')}>已安装</button>
          <button type="button" data-on={tab==='find'} onClick={() => setTab('find')}>发现</button>
        </div>
      </div>
      <div className="card">
        {(tab === 'in'
          ? [
              ['code-review', 'skills.sh · Claude Code, Codex'],
              ['git-commit', 'GitHub · Claude Code'],
            ]
          : [
              ['pdf-extract', '抽取 PDF'],
              ['web-research', '多源检索'],
            ]
        ).map(([name, sub]) => (
          <div key={name} className="row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 560 }}>{name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>
            </div>
            <button type="button" className="btn" onClick={() => toast(tab === 'in' ? '同步' : '安装')}>
              {tab === 'in' ? '同步' : '安装'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
