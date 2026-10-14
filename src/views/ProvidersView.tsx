import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  GripVertical,
  Plus,
  Pencil,
  Copy,
  Gauge,
  BarChart3,
  Trash2,
  Loader2,
  Check,
  ExternalLink,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { AGENTS, type AgentId } from '../lib/types'

type Provider = {
  id: string
  name: string
  notes: string
  endpoint: string
  iconBg: string
  iconLabel: string
  category: 'official' | 'third_party' | 'custom'
  usage?: { label: string; detail: string }
  latency?: number | null
}

const PRESETS: Provider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic 官方',
    notes: 'Claude Pro / Max 订阅额度',
    endpoint: 'https://api.anthropic.com',
    iconBg: '#d97706',
    iconLabel: 'A',
    category: 'official',
    usage: { label: '额度', detail: '剩余约 68%' },
    latency: 186,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    notes: 'ChatGPT Plus / API',
    endpoint: 'https://api.openai.com/v1',
    iconBg: '#10a37f',
    iconLabel: 'O',
    category: 'official',
    usage: { label: '用量', detail: '本月 $12.4' },
    latency: 142,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    notes: '性价比推理 / 编码',
    endpoint: 'https://api.deepseek.com',
    iconBg: '#4f6bed',
    iconLabel: 'D',
    category: 'third_party',
    usage: { label: '余额', detail: '¥86.20' },
    latency: 98,
  },
  {
    id: 'glm',
    name: '智谱 GLM',
    notes: '国内直连 · Coding Plan',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    iconBg: '#7c5cbf',
    iconLabel: '智',
    category: 'third_party',
    usage: { label: '额度', detail: '未查询' },
    latency: null,
  },
  {
    id: 'kimi',
    name: 'Moonshot Kimi',
    notes: '长上下文 · 审阅',
    endpoint: 'https://api.moonshot.cn/v1',
    iconBg: '#0d9488',
    iconLabel: 'K',
    category: 'third_party',
    usage: { label: '额度', detail: '剩余 42%' },
    latency: 210,
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    notes: '中转聚合 · 多模型',
    endpoint: 'https://api.siliconflow.cn/v1',
    iconBg: '#6366f1',
    iconLabel: 'S',
    category: 'custom',
    usage: { label: '余额', detail: '¥23.50' },
    latency: 156,
  },
]

function latencyColor(ms: number | null | undefined) {
  if (ms == null) return 'text-[#9c9ca8]'
  if (ms < 300) return 'text-[#1f7a4a]'
  if (ms < 500) return 'text-[#a16207]'
  if (ms < 800) return 'text-[#c2410c]'
  return 'text-[#b91c1c]'
}

export function ProvidersView({
  agent,
  onAgentChange,
  gatewayOn,
}: {
  agent: AgentId
  onAgentChange: (id: AgentId) => void
  gatewayOn: boolean
}) {
  const { toast } = useToast()
  const [items, setItems] = useState(PRESETS)
  const [currentId, setCurrentId] = useState('anthropic')
  const [testingId, setTestingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [dragFrom, setDragFrom] = useState<number | null>(null)

  const onDrop = (toIndex: number) => {
    if (dragFrom == null || dragFrom === toIndex) {
      setDragFrom(null)
      return
    }
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragFrom, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    setDragFrom(null)
    toast('已调整供应商顺序')
  }

  const runTest = (p: Provider) => {
    if (testingId) return
    setTestingId(p.id)
    toast(`测速中：${p.name}…`)
    window.setTimeout(() => {
      const ms = 60 + Math.floor(Math.random() * 420)
      setItems((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, latency: ms } : x)),
      )
      setTestingId(null)
      toast(`${p.name} 延迟 ${ms} ms`)
    }, 900)
  }

  return (
    <div className="view-fade flex h-full flex-col overflow-hidden bg-[#fafafa]">
      {/* Page toolbar — App switcher + Add + proxy hint */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#ebebef] bg-white/80 px-4 py-2.5">
        <div className="seg-track flex gap-0">
          {AGENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              data-active={agent === a.id}
              onClick={() => {
                onAgentChange(a.id)
                toast(`Provider 视图 · ${a.label}`)
              }}
              className={`seg-item rounded-[6px] px-2.5 py-[5px] text-[11.5px] tracking-tight ${
                agent === a.id
                  ? 'font-medium text-[#1a1a1c]'
                  : 'text-[#6b6b76] hover:text-[#3a3a42]'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <span
            className={`hidden items-center gap-1 rounded-full px-2 py-[3px] text-[10.5px] font-medium sm:inline-flex ${
              gatewayOn
                ? 'bg-[#e8f6ee] text-[#1f7a4a]'
                : 'bg-[#f0f0f3] text-[#8a8a96]'
            }`}
          >
            <span
              className={`h-[5px] w-[5px] rounded-full ${gatewayOn ? 'bg-[#2bb673]' : 'bg-[#a0a0aa]'}`}
            />
            Proxy {gatewayOn ? '开' : '关'}
          </span>
          <button
            type="button"
            onClick={() => toast('Demo：添加供应商（预设向导）')}
            className="inline-flex items-center gap-1 rounded-[6px] bg-[#1a1a1c] px-2.5 py-[5px] text-[11.5px] font-medium text-white hover:bg-[#333]"
          >
            <Plus className="h-3 w-3" strokeWidth={2.25} />
            添加 Provider
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3.5">
        <p className="mb-2.5 text-[11px] leading-relaxed text-[#9c9ca8]">
          对标 CC Switch：拖拽排序 · 启用蓝边 · 悬停操作 · 测速 / 用量 / 复制 / 删除。当前入口{' '}
          <span className="font-medium text-[#5c5c66]">
            {AGENTS.find((a) => a.id === agent)?.label}
          </span>
          。
        </p>

        <div className="flex flex-col gap-2">
          {items.map((p, index) => {
            const isCurrent = p.id === currentId
            const showActions = hoveredId === p.id || isCurrent
            const testing = testingId === p.id

            return (
              <div
                key={p.id}
                draggable
                onDragStart={() => setDragFrom(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(index)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative rounded-[12px] bg-white transition-[box-shadow,border-color,transform] duration-150 ${
                  isCurrent
                    ? 'border-[1.5px] border-[#2f6fed] shadow-[0_1px_4px_rgba(47,111,237,0.12)]'
                    : 'border border-[#e8e8ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#d8d8e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                }`}
              >
                <div className="flex items-stretch gap-0">
                  {/* Drag handle */}
                  <button
                    type="button"
                    className="flex w-7 shrink-0 cursor-grab items-center justify-center text-[#c5c5ce] active:cursor-grabbing hover:text-[#8a8a96]"
                    title="拖拽排序"
                    onClick={() => toast('按住拖拽可排序')}
                  >
                    <GripVertical className="h-4 w-4" strokeWidth={1.75} />
                  </button>

                  <div className="flex min-w-0 flex-1 items-start gap-3 py-3 pr-3">
                    {/* Icon block */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[13px] font-bold text-white"
                      style={{ background: p.iconBg }}
                    >
                      {p.iconLabel}
                    </div>

                    {/* Main info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[13px] font-semibold tracking-tight text-[#1a1a1c]">
                          {p.name}
                        </span>
                        {isCurrent && (
                          <span className="rounded-[4px] bg-[#eef3ff] px-1.5 py-[1px] text-[10px] font-medium text-[#2f6fed]">
                            当前启用
                          </span>
                        )}
                        {p.category === 'official' && (
                          <span className="rounded-[4px] bg-[#f4f4f6] px-1.5 py-[1px] text-[10px] text-[#8a8a96]">
                            官方
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-[#8a8a96]">{p.notes}</div>
                      <button
                        type="button"
                        onClick={() => toast(`打开：${p.endpoint}`)}
                        className="mt-1 inline-flex max-w-full items-center gap-1 truncate font-mono text-[10.5px] text-[#9c9ca8] hover:text-[#2f6fed]"
                      >
                        <span className="truncate">{p.endpoint}</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
                      </button>

                      {/* Usage footer */}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
                        {p.usage && (
                          <span className="text-[#5c5c66]">
                            <span className="text-[#9c9ca8]">{p.usage.label} · </span>
                            {p.usage.detail}
                          </span>
                        )}
                        <span className={`tabular-nums ${latencyColor(p.latency)}`}>
                          {testing
                            ? '测速中…'
                            : p.latency != null
                              ? `${p.latency} ms`
                              : '未测速'}
                        </span>
                      </div>
                    </div>

                    {/* Actions — hover / current */}
                    <div
                      className={`flex shrink-0 flex-col items-end gap-1.5 transition-opacity duration-150 ${
                        showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <div className="flex flex-wrap justify-end gap-1">
                        <ActionBtn
                          primary={isCurrent}
                          onClick={() => {
                            if (isCurrent) {
                              toast(`${p.name} 已是当前启用`)
                              return
                            }
                            setCurrentId(p.id)
                            toast(`已启用：${p.name}（写入 ${AGENTS.find((a) => a.id === agent)?.label} 配置）`)
                          }}
                        >
                          {isCurrent ? (
                            <>
                              <Check className="h-3 w-3" strokeWidth={2.5} />
                              使用中
                            </>
                          ) : (
                            '启用'
                          )}
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => toast(`Demo：编辑 ${p.name}`)}
                          title="编辑"
                        >
                          <Pencil className="h-3 w-3" strokeWidth={1.85} />
                          编辑
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => {
                            setItems((prev) => {
                              const copy: Provider = {
                                ...p,
                                id: `${p.id}-copy-${Date.now()}`,
                                name: `${p.name} 副本`,
                              }
                              const i = prev.findIndex((x) => x.id === p.id)
                              const next = [...prev]
                              next.splice(i + 1, 0, copy)
                              return next
                            })
                            toast(`已复制：${p.name}`)
                          }}
                          title="复制"
                        >
                          <Copy className="h-3 w-3" strokeWidth={1.85} />
                          复制
                        </ActionBtn>
                      </div>
                      <div className="flex flex-wrap justify-end gap-1">
                        <ActionBtn
                          onClick={() => runTest(p)}
                          disabled={!!testingId}
                          title="测速"
                        >
                          {testing ? (
                            <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                          ) : (
                            <Gauge className="h-3 w-3" strokeWidth={1.85} />
                          )}
                          测速
                        </ActionBtn>
                        <ActionBtn
                          onClick={() =>
                            toast(
                              p.usage
                                ? `${p.name} ${p.usage.label}：${p.usage.detail}`
                                : `Demo：查询 ${p.name} 用量`,
                            )
                          }
                          title="用量查询"
                        >
                          <BarChart3 className="h-3 w-3" strokeWidth={1.85} />
                          用量
                        </ActionBtn>
                        <ActionBtn
                          danger
                          disabled={isCurrent}
                          title={isCurrent ? '当前启用不可删除' : '删除'}
                          onClick={() => {
                            if (isCurrent) {
                              toast('当前启用的供应商不可删除，请先切换')
                              return
                            }
                            setItems((prev) => prev.filter((x) => x.id !== p.id))
                            toast(`已删除：${p.name}`)
                          }}
                        >
                          <Trash2 className="h-3 w-3" strokeWidth={1.85} />
                          删除
                        </ActionBtn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ActionBtn({
  children,
  onClick,
  primary,
  danger,
  disabled,
  title,
}: {
  children: ReactNode
  onClick: () => void
  primary?: boolean
  danger?: boolean
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-[6px] px-2 py-[4px] text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? 'bg-[#eef3ff] text-[#2f6fed]'
          : danger
            ? 'bg-[#faf4f4] text-[#a33a3a] hover:bg-[#f8eaea]'
            : 'bg-[#f4f4f6] text-[#5c5c66] hover:bg-[#ececef]'
      }`}
    >
      {children}
    </button>
  )
}
