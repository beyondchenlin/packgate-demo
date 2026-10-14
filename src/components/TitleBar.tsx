import { useState } from 'react'
import { ChevronDown, Power } from 'lucide-react'
import { AGENTS, PROFILES, type AgentId, type ProfileId } from '../lib/types'
import { useToast } from '../lib/toast'

export function TitleBar({
  gatewayOn,
  onToggleGateway,
  agent,
  onAgentChange,
  profile,
  onProfileChange,
}: {
  gatewayOn: boolean
  onToggleGateway: () => void
  agent: AgentId
  onAgentChange: (id: AgentId) => void
  profile: ProfileId
  onProfileChange: (id: ProfileId) => void
}) {
  const { toast } = useToast()
  const [agentOpen, setAgentOpen] = useState(false)
  const [profOpen, setProfOpen] = useState(false)
  const agentLabel = AGENTS.find((a) => a.id === agent)?.label ?? agent
  const profLabel = PROFILES.find((p) => p.id === profile)?.label ?? profile

  return (
    <header className="titlebar-glass relative z-20 flex h-[40px] shrink-0 items-center px-3">
      <div className="flex items-center gap-[7px]">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57] shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.15)]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e] shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.12)]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840] shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.12)]" />
      </div>

      <div className="ml-3.5 flex items-center gap-1.5">
        <span className="text-[12.5px] font-semibold tracking-tight text-[#1a1a1c]">
          PackGate
        </span>
        <span className="rounded bg-[#ebebef] px-1 py-[1px] text-[9.5px] font-medium text-[#6b6b76]">
          Demo
        </span>
      </div>

      <div className="relative ml-3">
        <button
          type="button"
          onClick={() => {
            setProfOpen((v) => !v)
            setAgentOpen(false)
          }}
          className="flex items-center gap-1 rounded-md border border-[#e2e2e8] bg-white/80 px-2 py-[3px] text-[11px] text-[#3a3a42] hover:bg-white"
        >
          方案 · {profLabel}
          <ChevronDown className="h-3 w-3 text-[#9c9ca8]" />
        </button>
        {profOpen && (
          <div className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[140px] overflow-hidden rounded-lg border border-[#e2e2e8] bg-white py-1 shadow-lg">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`flex w-full px-3 py-1.5 text-left text-[12px] hover:bg-[#f5f5f7] ${
                  p.id === profile ? 'font-medium text-[#2f6fed]' : 'text-[#3a3a42]'
                }`}
                onClick={() => {
                  onProfileChange(p.id)
                  setProfOpen(false)
                  toast(`已切换方案「${p.label}」`)
                }}
              >
                {p.label}
              </button>
            ))}
            <div className="my-1 border-t border-[#ebebef]" />
            <button
              type="button"
              className="flex w-full px-3 py-1.5 text-left text-[12px] text-[#3a3a42] hover:bg-[#f5f5f7]"
              onClick={() => {
                setProfOpen(false)
                toast('新建方案（Demo）')
              }}
            >
              + 新建方案…
            </button>
          </div>
        )}
      </div>

      <div className="relative ml-1.5">
        <button
          type="button"
          onClick={() => {
            setAgentOpen((v) => !v)
            setProfOpen(false)
          }}
          className="flex items-center gap-1 rounded-md border border-[#e2e2e8] bg-white/80 px-2 py-[3px] text-[11px] text-[#3a3a42] hover:bg-white"
        >
          {agentLabel}
          <ChevronDown className="h-3 w-3 text-[#9c9ca8]" />
        </button>
        {agentOpen && (
          <div className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[160px] overflow-hidden rounded-lg border border-[#e2e2e8] bg-white py-1 shadow-lg">
            {AGENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={!a.installed}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] ${
                  !a.installed
                    ? 'cursor-not-allowed text-[#b0b0ba]'
                    : a.id === agent
                      ? 'font-medium text-[#2f6fed] hover:bg-[#f5f5f7]'
                      : 'text-[#3a3a42] hover:bg-[#f5f5f7]'
                }`}
                onClick={() => {
                  if (!a.installed) return
                  onAgentChange(a.id)
                  setAgentOpen(false)
                  toast(`当前 Agent：${a.label}`)
                }}
              >
                {a.label}
                {!a.installed && (
                  <span className="text-[10px] text-[#b0b0ba]">未安装</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleGateway}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium transition ${
            gatewayOn
              ? 'bg-[#e8f8ee] text-[#0f7a3f]'
              : 'bg-[#f3f3f5] text-[#6b6b76]'
          }`}
        >
          <Power className="h-3 w-3" strokeWidth={2.2} />
          {gatewayOn ? '网关 · :3425' : '网关关闭'}
        </button>
      </div>
    </header>
  )
}
