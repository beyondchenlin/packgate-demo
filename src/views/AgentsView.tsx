import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AGENTS, PROFILES, type AgentId, type ProfileId } from '../lib/types'
import { useToast } from '../lib/toast'

const PICK: Record<string, string[]> = {
  'claude-code': ['pack/视频多模态', 'claude-opus-4', 'group/daily-coding', '本地 · 自带额度'],
  codex: ['gpt-5.4', 'pack/视频多模态', 'deepseek-v3', '本地 · 自带额度'],
  workbuddy: ['workbuddy-free', 'pack/ReachFlow', 'glm-4.6'],
  gemini: ['gemini-2.5-pro', 'group/cheap'],
  'cursor-cli': ['cursor-default', 'pack/视频多模态'],
  opencode: [],
}

export function AgentsView({
  agent,
  onAgentChange,
}: {
  agent: AgentId
  onAgentChange: (id: AgentId) => void
}) {
  const { toast } = useToast()
  const [on, setOn] = useState<Record<string, boolean>>({
    'claude-code': true,
    codex: true,
    workbuddy: true,
    gemini: false,
    'cursor-cli': true,
  })
  const [model, setModel] = useState<Record<string, string>>({
    'claude-code': 'pack/视频多模态',
    codex: '本地 · 自带额度',
    workbuddy: 'workbuddy-free',
    gemini: 'gemini-2.5-pro',
    'cursor-cli': 'cursor-default',
  })
  const [open, setOpen] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileId>('default')

  return (
    <div className="page" onClick={() => setOpen(null)}>
      <div className="page-head">
        <h1>Agents</h1>
        <p>接入后，这里选的模型会出现在 Agent 的模型列表里；无后台 LLM 时用「本地 · 自带额度」。</p>
      </div>

      <div className="card">
        {AGENTS.filter((a) => a.installed).map((a) => (
          <div
            key={a.id}
            className="row"
            style={{
              background: a.id === agent ? 'rgba(79,70,229,0.03)' : undefined,
            }}
          >
            <span
              className="dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                background: a.color,
                flex: 'none',
              }}
            />
            <button
              type="button"
              style={{
                border: 0,
                background: 'transparent',
                textAlign: 'left',
                minWidth: 0,
                flex: 1,
                padding: 0,
                cursor: 'default',
              }}
              onClick={() => onAgentChange(a.id)}
            >
              <div style={{ fontWeight: 560, fontSize: 13 }}>{a.label}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                {on[a.id] ? '已接入 · 经 PackGate' : '未接入'}
              </div>
            </button>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="btn"
                style={{ minWidth: 150, justifyContent: 'space-between' }}
                onClick={() => setOpen(open === a.id ? null : a.id)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                  {model[a.id]}
                </span>
                <ChevronDown style={{ width: 12, height: 12, opacity: 0.5 }} />
              </button>
              {open === a.id && (
                <div className="more-menu" style={{ minWidth: 200 }}>
                  {(PICK[a.id] ?? []).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setModel((x) => ({ ...x, [a.id]: m }))
                        setOpen(null)
                        toast(`${a.label} → ${m}`)
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="toggle"
              data-on={!!on[a.id]}
              aria-label="接入"
              onClick={() => {
                setOn((x) => ({ ...x, [a.id]: !x[a.id] }))
                toast(on[a.id] ? `已断开 ${a.label}` : `已接入 ${a.label}`)
              }}
            >
              <i />
            </button>
          </div>
        ))}

        <div className="footer-bar">
          <span className="muted" style={{ fontSize: 12 }}>方案</span>
          {PROFILES.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              data-on={profile === p.id}
              onClick={() => {
                setProfile(p.id)
                toast(`方案 · ${p.label}`)
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 'auto' }}
            onClick={() => toast('已保存当前方案')}
          >
            + 保存当前
          </button>
        </div>
      </div>
    </div>
  )
}
