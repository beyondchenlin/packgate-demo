import { useState } from 'react'
import { ChevronDown, Star } from 'lucide-react'
import { AGENTS, type AgentId } from '../lib/types'
import { useToast } from '../lib/toast'

const MODELS: Record<string, string[]> = {
  'claude-code': ['claude-opus-4', 'pack/视频多模态', 'group/省钱组', 'deepseek-v3', '本地 · 自带额度'],
  codex: ['gpt-5.4', 'pack/视频多模态', 'deepseek-v3', '本地 · 自带额度'],
  workbuddy: ['workbuddy-free', 'pack/ReachFlow', 'glm-4.6'],
  gemini: ['gemini-2.5-pro', 'group/省钱组'],
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
  const [picked, setPicked] = useState<Record<string, string>>({
    'claude-code': 'pack/视频多模态',
    codex: '本地 · 自带额度',
    workbuddy: 'workbuddy-free',
    gemini: 'gemini-2.5-pro',
    'cursor-cli': 'cursor-default',
  })
  const [openFor, setOpenFor] = useState<string | null>(null)
  const [favs, setFavs] = useState<Record<string, string[]>>({
    'claude-code': ['pack/视频多模态', 'claude-opus-4'],
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#ebebef] px-4 py-2.5">
        <div className="text-[13px] font-semibold text-[#1a1a1c]">Agents</div>
        <div className="text-[11px] text-[#6b6b76]">
          点模型 → 可搜索列表；无后台 LLM 时优先「本地 · 自带额度」
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {AGENTS.map((a) => {
          const models = MODELS[a.id] ?? []
          const current = picked[a.id] ?? '—'
          return (
            <div
              key={a.id}
              className={`card-lift relative rounded-xl bg-white px-3 py-2.5 ${
                a.id === agent ? 'ring-1 ring-[#2f6fed]/30' : ''
              } ${!a.installed ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!a.installed}
                  onClick={() => {
                    onAgentChange(a.id)
                    toast(`聚焦 ${a.label}`)
                  }}
                  className="text-left"
                >
                  <div className="text-[13px] font-semibold text-[#1a1a1c]">{a.label}</div>
                  <div className="text-[10.5px] text-[#8a8a96]">
                    {a.installed ? '已检测安装' : '未安装 · 侧栏可隐藏'}
                  </div>
                </button>
                <div className="relative ml-auto">
                  <button
                    type="button"
                    disabled={!a.installed}
                    onClick={() => setOpenFor(openFor === a.id ? null : a.id)}
                    className="flex items-center gap-1 rounded-md border border-[#e2e2e8] bg-[#fafafa] px-2.5 py-1 text-[12px] text-[#1a1a1c] hover:bg-white"
                  >
                    <span className="max-w-[160px] truncate">{current}</span>
                    <ChevronDown className="h-3 w-3 text-[#9c9ca8]" />
                  </button>
                  {openFor === a.id && (
                    <div className="absolute right-0 top-[calc(100%+4px)] z-30 max-h-56 w-[240px] overflow-y-auto rounded-lg border border-[#e2e2e8] bg-white py-1 shadow-xl">
                      <div className="px-2.5 py-1 text-[10px] text-[#9c9ca8]">模型 / Pack / 组</div>
                      {models.map((m) => (
                        <button
                          key={m}
                          type="button"
                          className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[12px] hover:bg-[#f5f5f7] ${
                            m === current ? 'font-medium text-[#2f6fed]' : 'text-[#3a3a42]'
                          }`}
                          onClick={() => {
                            setPicked((p) => ({ ...p, [a.id]: m }))
                            setOpenFor(null)
                            toast(`${a.label} → ${m}`)
                          }}
                        >
                          <span className="flex-1 truncate">{m}</span>
                          <button
                            type="button"
                            className="text-[#9c9ca8] hover:text-[#f59e0b]"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFavs((f) => {
                                const cur = f[a.id] ?? []
                                const next = cur.includes(m)
                                  ? cur.filter((x) => x !== m)
                                  : [...cur, m]
                                return { ...f, [a.id]: next }
                              })
                              toast('已更新常用短名单')
                            }}
                          >
                            <Star
                              className={`h-3 w-3 ${
                                (favs[a.id] ?? []).includes(m)
                                  ? 'fill-[#f59e0b] text-[#f59e0b]'
                                  : ''
                              }`}
                            />
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {(favs[a.id] ?? []).length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {(favs[a.id] ?? []).map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-[#f5f5f7] px-2 py-[1px] text-[10px] text-[#5c5c66]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
