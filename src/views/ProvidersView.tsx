import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  Gauge,
  Loader2,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Power,
  Star,
  Terminal,
  Trash2,
  BarChart3,
  ListPlus,
  ListMinus,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { AGENTS, type AgentId } from '../lib/types'

type Mode = 'direct' | 'route' | 'stack'
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
  inStack?: boolean
  isDefault?: boolean
}

const SEED: Provider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic 官方',
    notes: 'Claude Pro / Max 订阅',
    endpoint: 'https://api.anthropic.com',
    iconBg: '#d97706',
    iconLabel: 'A',
    category: 'official',
    usage: { label: '额度', detail: '5h 剩余 68%' },
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
    inStack: true,
    isDefault: true,
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
    inStack: true,
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
    inStack: true,
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

const PRESET_ADD = [
  'Anthropic',
  'OpenAI',
  'DeepSeek',
  '智谱 GLM',
  'Moonshot',
  'SiliconFlow',
  'OpenRouter',
  '火山方舟',
  '阿里云百炼',
  '自定义…',
]

function latencyColor(ms: number | null | undefined) {
  if (ms == null) return 'text-[#9c9ca8]'
  if (ms < 120) return 'text-[#0f7a3f]'
  if (ms < 200) return 'text-[#a16207]'
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
  const [mode, setMode] = useState<Mode>('route')
  const [list, setList] = useState(SEED)
  const [activeId, setActiveId] = useState('deepseek')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [usageCfgId, setUsageCfgId] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase()
    let rows = list
    if (mode === 'stack') {
      // stack mode: members first
      rows = [...list].sort((a, b) => Number(b.inStack) - Number(a.inStack))
    }
    if (!q) return rows
    return rows.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q) ||
        p.endpoint.toLowerCase().includes(q),
    )
  }, [list, filter, mode])

  const move = (id: string, dir: -1 | 1) => {
    setList((prev) => {
      const i = prev.findIndex((p) => p.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    toast(dir < 0 ? '已上移（故障转移队列）' : '已下移（故障转移队列）')
  }

  const enable = (p: Provider) => {
    if (mode === 'direct') {
      setActiveId(p.id)
      toast(`已启用 ${p.name}（直连）`)
    } else if (mode === 'route') {
      setActiveId(p.id)
      toast(`路由到此处：${p.name}`)
    } else {
      setList((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, inStack: true } : x,
        ),
      )
      toast(`已加入聚合：${p.name}`)
    }
  }

  const test = (p: Provider) => {
    setTesting(p.id)
    setMenuId(null)
    setTimeout(() => {
      const ms = 80 + Math.floor(Math.random() * 180)
      setList((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, latency: ms } : x)),
      )
      setTesting(null)
      toast(`${p.name} 连通 ${ms} ms`)
    }, 900)
  }

  const remove = (p: Provider) => {
    setList((prev) => prev.filter((x) => x.id !== p.id))
    setMenuId(null)
    toast(`已删除 ${p.name}`)
  }

  const duplicate = (p: Provider) => {
    const id = `${p.id}-copy-${Date.now().toString(36).slice(-4)}`
    setList((prev) => [
      ...prev,
      { ...p, id, name: `${p.name} 副本`, isDefault: false },
    ])
    setMenuId(null)
    toast(`已复制 ${p.name}`)
  }

  const agentLabel = AGENTS.find((a) => a.id === agent)?.label ?? agent

  return (
    <div className="flex h-full flex-col" onClick={() => setMenuId(null)}>
      <div className="flex items-center gap-2 border-b border-[#ebebef] px-4 py-2.5">
        <select
          value={agent}
          onChange={(e) => onAgentChange(e.target.value as AgentId)}
          className="rounded-md border border-[#e2e2e8] bg-white px-2 py-1 text-[12px] text-[#1a1a1c]"
        >
          {AGENTS.filter((a) => a.installed).map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>

        <div className="seg-track flex">
          {(
            [
              ['direct', '直连'],
              ['route', '路由'],
              ['stack', '聚合'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMode(id)
                toast(
                  id === 'direct'
                    ? '查看直连供应商'
                    : id === 'route'
                      ? '查看路由队列'
                      : '查看聚合成员',
                )
              }}
              className={`seg-item rounded-[6px] px-2.5 py-[4px] text-[11.5px] ${
                mode === id
                  ? 'bg-white font-medium text-[#1a1a1c] shadow-sm'
                  : 'text-[#6b6b76]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="搜索供应商…"
          className="ml-1 w-[140px] rounded-md border border-[#e2e2e8] bg-white px-2 py-1 text-[12px] outline-none focus:border-[#2f6fed]/40"
        />

        <div className="ml-auto flex items-center gap-2">
          {mode === 'route' && (
            <button
              type="button"
              onClick={() =>
                toast(
                  gatewayOn
                    ? `已为 ${agentLabel} 开始路由`
                    : '请先开启网关',
                )
              }
              className="rounded-md bg-[#2f6fed] px-2.5 py-1 text-[11.5px] font-medium text-white hover:bg-[#2563eb]"
            >
              开始路由
            </button>
          )}
          {mode === 'stack' && (
            <button
              type="button"
              onClick={() => toast(`已切换到聚合模式 · ${agentLabel}`)}
              className="rounded-md bg-[#2f6fed] px-2.5 py-1 text-[11.5px] font-medium text-white hover:bg-[#2563eb]"
            >
              切换到聚合
            </button>
          )}
          {mode === 'direct' && (
            <button
              type="button"
              onClick={() => toast('已回到直连')}
              className="rounded-md border border-[#e2e2e8] bg-white px-2.5 py-1 text-[11.5px] text-[#3a3a42] hover:bg-[#f5f5f7]"
            >
              回到直连
            </button>
          )}
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1 rounded-md border border-[#e2e2e8] bg-white px-2 py-1 text-[11.5px] font-medium text-[#1a1a1c] hover:bg-[#f5f5f7]"
          >
            <Plus className="h-3.5 w-3.5" />
            添加
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {mode === 'route' && (
          <div className="rounded-lg border border-[#dbeafe] bg-[#f0f7ff] px-3 py-2 text-[11.5px] text-[#1e40af]">
            路由模式：卡片右侧上下键调整故障转移顺序；主操作「路由到此处」立即生效。
          </div>
        )}
        {mode === 'stack' && (
          <div className="rounded-lg border border-[#e9e0ff] bg-[#f8f5ff] px-3 py-2 text-[11.5px] text-[#5b21b6]">
            聚合模式：多家供应商模型进入同一选择器；星标为默认回退。
          </div>
        )}

        {shown.map((p, idx) => {
          const enabled =
            mode === 'stack' ? !!p.inStack : activeId === p.id
          const primaryLabel =
            mode === 'direct'
              ? enabled
                ? '使用中'
                : '启用'
              : mode === 'route'
                ? enabled
                  ? '当前路由'
                  : '路由到此处'
                : enabled
                  ? p.isDefault
                    ? '默认'
                    : '已添加'
                  : '添加'

          return (
            <div
              key={p.id}
              className={`card-lift relative flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ${
                enabled ? 'ring-1 ring-[#2f6fed]/25' : ''
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                style={{ background: p.iconBg }}
              >
                {p.iconLabel}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-semibold text-[#1a1a1c]">
                    {p.name}
                  </span>
                  {p.isDefault && mode === 'stack' && (
                    <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
                  )}
                  <span className="rounded bg-[#f3f3f5] px-1 py-[1px] text-[9.5px] text-[#6b6b76]">
                    {p.category === 'official'
                      ? '官方'
                      : p.category === 'third_party'
                        ? '第三方'
                        : '自定义'}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-[11px] text-[#6b6b76]">
                  {p.notes} · {p.endpoint.replace(/^https?:\/\//, '')}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10.5px]">
                  {p.usage && (
                    <span className="rounded bg-[#f5f5f7] px-1.5 py-[1px] text-[#3a3a42]">
                      {p.usage.label} {p.usage.detail}
                    </span>
                  )}
                  <span className={latencyColor(p.latency)}>
                    {p.latency != null ? `${p.latency} ms` : '未测速'}
                  </span>
                </div>
              </div>

              {/* primary */}
              <div className="flex shrink-0 items-center gap-1">
                {enabled && mode !== 'stack' ? (
                  <span className="inline-flex items-center gap-1.5 px-1 text-[12px] font-medium text-[#1a1a1c]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2f6fed]" />
                    {primaryLabel}
                  </span>
                ) : (
                  <button
                    type="button"
                    title={primaryLabel}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (mode === 'stack' && enabled) {
                        setList((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, inStack: false } : x,
                          ),
                        )
                        toast(`已从聚合移除 ${p.name}`)
                      } else {
                        enable(p)
                      }
                    }}
                    className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5] hover:text-[#1a1a1c]"
                  >
                    {mode === 'stack' && enabled ? (
                      <ListMinus className="h-4 w-4" />
                    ) : mode === 'stack' ? (
                      <ListPlus className="h-4 w-4" />
                    ) : mode === 'route' ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </button>
                )}

                {/* move up/down — CC Switch failover queue */}
                <button
                  type="button"
                  disabled={idx === 0}
                  title="上移"
                  onClick={(e) => {
                    e.stopPropagation()
                    move(p.id, -1)
                  }}
                  className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5] disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  disabled={idx === shown.length - 1}
                  title="下移"
                  onClick={(e) => {
                    e.stopPropagation()
                    move(p.id, 1)
                  }}
                  className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5] disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
                </button>

                <button
                  type="button"
                  title="编辑"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditId(p.id)
                  }}
                  className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5]"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.5} />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    title="更多"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuId(menuId === p.id ? null : p.id)
                    }}
                    className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5]"
                  >
                    <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  {menuId === p.id && (
                    <div
                      className="absolute right-0 top-[calc(100%+4px)] z-40 min-w-[180px] overflow-hidden rounded-lg border border-[#e2e2e8] bg-white py-1 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {mode === 'stack' && enabled && !p.isDefault && (
                        <MenuItem
                          icon={<Star className="h-3.5 w-3.5" />}
                          label="设为默认"
                          onClick={() => {
                            setList((prev) =>
                              prev.map((x) => ({
                                ...x,
                                isDefault: x.id === p.id,
                              })),
                            )
                            setMenuId(null)
                            toast(`${p.name} 已设为默认`)
                          }}
                        />
                      )}
                      <MenuItem
                        icon={<Copy className="h-3.5 w-3.5" />}
                        label="复制"
                        onClick={() => duplicate(p)}
                      />
                      <MenuItem
                        icon={
                          testing === p.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Gauge className="h-3.5 w-3.5" />
                          )
                        }
                        label="检测连通"
                        onClick={() => test(p)}
                      />
                      <MenuItem
                        icon={<BarChart3 className="h-3.5 w-3.5" />}
                        label="配置用量查询"
                        onClick={() => {
                          setUsageCfgId(p.id)
                          setMenuId(null)
                        }}
                      />
                      <MenuItem
                        icon={<Terminal className="h-3.5 w-3.5" />}
                        label="打开终端"
                        onClick={() => {
                          setMenuId(null)
                          toast(`打开终端 · ${p.name}（Demo）`)
                        }}
                      />
                      <div className="my-1 border-t border-[#ebebef]" />
                      <MenuItem
                        icon={<Trash2 className="h-3.5 w-3.5" />}
                        label="删除"
                        danger
                        onClick={() => remove(p)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add dialog */}
      {addOpen && (
        <Modal title="添加供应商" onClose={() => setAddOpen(false)}>
          <p className="mb-2 text-[12px] text-[#6b6b76]">
            选择预设或创建自定义（对标 CC Switch 预设搜索）
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_ADD.map((name) => (
              <button
                key={name}
                type="button"
                className="rounded-lg border border-[#e2e2e8] bg-[#fafafa] px-2.5 py-2 text-left text-[12px] hover:border-[#2f6fed]/40 hover:bg-white"
                onClick={() => {
                  const id = `custom-${Date.now().toString(36).slice(-5)}`
                  setList((prev) => [
                    ...prev,
                    {
                      id,
                      name,
                      notes: '新添加 · Demo',
                      endpoint: 'https://api.example.com/v1',
                      iconBg: '#64748b',
                      iconLabel: name[0]!,
                      category: 'custom',
                      latency: null,
                    },
                  ])
                  setAddOpen(false)
                  toast(`已添加 ${name}`)
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {editId && (
        <Modal
          title={`编辑 · ${list.find((x) => x.id === editId)?.name}`}
          onClose={() => setEditId(null)}
        >
          <Field label="名称" value={list.find((x) => x.id === editId)?.name} />
          <Field
            label="API Base URL"
            value={list.find((x) => x.id === editId)?.endpoint}
          />
          <Field label="API Key" value="sk-••••••••••••••••" />
          <Field label="默认模型" value="auto" />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-[12px] text-[#6b6b76]"
              onClick={() => setEditId(null)}
            >
              取消
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md bg-[#2f6fed] px-3 py-1.5 text-[12px] font-medium text-white"
              onClick={() => {
                setEditId(null)
                toast('已保存（Demo）')
              }}
            >
              <Check className="h-3.5 w-3.5" />
              保存
            </button>
          </div>
        </Modal>
      )}

      {usageCfgId && (
        <Modal
          title={`配置用量查询 · ${list.find((x) => x.id === usageCfgId)?.name}`}
          onClose={() => setUsageCfgId(null)}
        >
          <p className="mb-2 text-[12px] text-[#6b6b76]">
            官方订阅 / Coding Plan / 余额接口 / 自定义脚本
          </p>
          {['官方订阅额度', 'Coding Plan（5h/周/月）', '账户余额 API', '自定义脚本'].map(
            (opt) => (
              <button
                key={opt}
                type="button"
                className="mb-1.5 flex w-full items-center justify-between rounded-lg border border-[#e2e2e8] px-3 py-2 text-left text-[12px] hover:bg-[#f5f5f7]"
                onClick={() => {
                  setUsageCfgId(null)
                  toast(`已配置：${opt}`)
                }}
              >
                {opt}
                <ExternalLink className="h-3.5 w-3.5 text-[#9c9ca8]" />
              </button>
            ),
          )}
        </Modal>
      )}
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] hover:bg-[#f5f5f7] ${
        danger ? 'text-[#b91c1c]' : 'text-[#3a3a42]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/25 p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90%] w-full max-w-md overflow-y-auto rounded-xl border border-[#e2e2e8] bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#1a1a1c]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-[#9c9ca8] hover:text-[#1a1a1c]"
          >
            关闭
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-[11px] text-[#6b6b76]">{label}</span>
      <input
        defaultValue={value}
        className="w-full rounded-md border border-[#e2e2e8] bg-[#fafafa] px-2.5 py-1.5 text-[12px] outline-none focus:border-[#2f6fed]/40"
      />
    </label>
  )
}
