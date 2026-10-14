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
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-3">
      <div className="flex items-center gap-1.5 pl-1">
        <button
          type="button"
          className="h-3 w-3 rounded-full bg-[#ff5f57] hover:brightness-95"
          title="关闭"
          onClick={() => toast('Demo：关闭窗口（仅示意）')}
        />
        <button
          type="button"
          className="h-3 w-3 rounded-full bg-[#febc2e] hover:brightness-95"
          title="最小化"
          onClick={() => toast('Demo：最小化（仅示意）')}
        />
        <button
          type="button"
          className="h-3 w-3 rounded-full bg-[#28c840] hover:brightness-95"
          title="最大化"
          onClick={() => toast('Demo：最大化（仅示意）')}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold tracking-tight text-slate-800">
          PackGate
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            gatewayOn
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80'
              : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${gatewayOn ? 'bg-emerald-500' : 'bg-slate-400'}`}
          />
          {gatewayOn ? 'localhost:3425' : '网关已停'}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleGateway}
          className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
            gatewayOn
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {gatewayOn ? 'Proxy 开' : 'Proxy 关'}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
          >
            {current.label}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {open && (
            <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {AGENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`block w-full px-3 py-1.5 text-left text-[12px] hover:bg-slate-50 ${
                    a.id === agent ? 'font-medium text-blue-600' : 'text-slate-700'
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
          )}
        </div>
      </div>
    </div>
  )
}
