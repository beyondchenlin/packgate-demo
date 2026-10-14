import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AGENTS, type AgentId } from '../lib/types'
import { useToast } from '../lib/toast'

export function TitleBar({
  gatewayOn,
  onToggleGateway,
  agent,
  onAgentChange,
}: {
  gatewayOn: boolean
  onToggleGateway: () => void
  agent: AgentId
  onAgentChange: (id: AgentId) => void
}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const current = AGENTS.find((a) => a.id === agent)!

  return (
    <div className="titlebar-glass flex h-10 shrink-0 items-center gap-3 px-3.5">
      <div className="flex items-center gap-[7px]">
        <button
          type="button"
          className="traffic-light bg-[#ff5f57] hover:brightness-[0.96]"
          title="关闭"
          onClick={() => toast('Demo：关闭窗口（仅示意）')}
        />
        <button
          type="button"
          className="traffic-light bg-[#febc2e] hover:brightness-[0.96]"
          title="最小化"
          onClick={() => toast('Demo：最小化（仅示意）')}
        />
        <button
          type="button"
          className="traffic-light bg-[#28c840] hover:brightness-[0.96]"
          title="最大化"
          onClick={() => toast('Demo：最大化（仅示意）')}
        />
      </div>

      <div className="flex items-center gap-2.5">
        <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-[#1a1a1c]">
          PackGate
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10.5px] font-medium tracking-tight ${
            gatewayOn
              ? 'bg-[#e8f6ee] text-[#1f7a4a]'
              : 'bg-[#eeeef0] text-[#6b6b76]'
          }`}
        >
          <span
            className={`h-[5px] w-[5px] rounded-full ${gatewayOn ? 'bg-[#2bb673]' : 'bg-[#a0a0aa]'}`}
          />
          {gatewayOn ? 'localhost:3425' : '网关已停'}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleGateway}
          className={`rounded-[6px] px-2.5 py-[4px] text-[11.5px] font-medium tracking-tight transition-colors ${
            gatewayOn
              ? 'bg-[#1a1a1c] text-white hover:bg-[#333]'
              : 'bg-[#e8e8ec] text-[#555] hover:bg-[#dddde3]'
          }`}
        >
          {gatewayOn ? 'Proxy' : 'Proxy 关'}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-[6px] bg-white/80 px-2.5 py-[4px] text-[11.5px] text-[#3a3a42] shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)] hover:bg-white"
          >
            {current.label}
            <ChevronDown className="h-3 w-3 text-[#9c9ca8]" strokeWidth={2} />
          </button>
          {open && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                aria-label="关闭菜单"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1.5 w-[148px] overflow-hidden rounded-[8px] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.06)]">
                {AGENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={`block w-full px-3 py-[6px] text-left text-[12px] hover:bg-[#f5f5f7] ${
                      a.id === agent
                        ? 'font-medium text-[#1a1a1c]'
                        : 'text-[#55555e]'
                    }`}
                    onClick={() => {
                      onAgentChange(a.id)
                      setOpen(false)
                      toast(`已切换入口 Agent：${a.label}`)
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
