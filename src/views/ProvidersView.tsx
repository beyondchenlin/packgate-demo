import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Copy,
  Gauge,
  Layers,
  Loader2,
  MoreHorizontal,
  Pencil,
  Play,
  Plug,
  Route,
  Terminal,
  Trash2,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { APPS, type AgentId } from '../lib/types'

type Mode = 'direct' | 'route' | 'stack'
type Provider = {
  id: string
  name: string
  endpoint: string
  iconBg: string
  iconLabel: string
  chip?: string
  usage?: string
  latency?: number | null
  inStack?: boolean
  isDefault?: boolean
}

const SEED: Provider[] = [
  { id: 'claude', name: 'Claude Official', endpoint: 'https://api.anthropic.com', iconBg: '#d97706', iconLabel: 'A', chip: '官方', usage: '5 小时剩余 68%', latency: 186 },
  { id: 'openai', name: 'OpenAI', endpoint: 'https://api.openai.com', iconBg: '#10a37f', iconLabel: 'O', chip: '官方', usage: '本月 $12.4', latency: 142, inStack: true, isDefault: true },
  { id: 'deepseek', name: 'DeepSeek', endpoint: 'https://api.deepseek.com', iconBg: '#4f6bed', iconLabel: 'D', usage: '余额 86.20 CNY', latency: 98, inStack: true },
  { id: 'kimi', name: 'Kimi For Coding', endpoint: 'https://api.moonshot.cn', iconBg: '#0d9488', iconLabel: 'K', usage: '5 小时剩余 42%', latency: 210, inStack: true },
  { id: 'glm', name: '智谱 GLM', endpoint: 'https://open.bigmodel.cn', iconBg: '#7c5cbf', iconLabel: '智', chip: '需要路由', usage: '未查询', latency: null },
  { id: 'silicon', name: 'SiliconFlow', endpoint: 'https://api.siliconflow.cn', iconBg: '#64748b', iconLabel: 'S', usage: '余额 23.50 CNY', latency: 156 },
]

const PRESETS = ['Claude Official', 'OpenAI', 'DeepSeek', 'Kimi', '智谱 GLM', 'SiliconFlow', 'OpenRouter', '自定义']

export function ProvidersView({
  agent,
  onAgentChange,
  proxyOn,
  addSignal,
}: {
  agent: AgentId
  onAgentChange: (id: AgentId) => void
  proxyOn: boolean
  addSignal: number
}) {
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>('direct')
  const [list, setList] = useState(SEED)
  const [activeId, setActiveId] = useState('claude')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [usageId, setUsageId] = useState<string | null>(null)

  useEffect(() => {
    if (addSignal > 0) setAddOpen(true)
  }, [addSignal])

  const shown = useMemo(() => {
    if (mode !== 'stack') return list
    return [...list].sort((a, b) => Number(!!b.inStack) - Number(!!a.inStack))
  }, [list, mode])

  const move = (id: string, dir: -1 | 1) => {
    setList((prev) => {
      const i = prev.findIndex((p) => p.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j]!, next[i]!]
      return next
    })
  }

  const test = (p: Provider) => {
    setMenuId(null)
    setTesting(p.id)
    setTimeout(() => {
      const ms = 70 + Math.floor(Math.random() * 160)
      setList((xs) => xs.map((x) => (x.id === p.id ? { ...x, latency: ms } : x)))
      setTesting(null)
      toast(`${p.name} · ${ms} ms`)
    }, 650)
  }

  const modeHint =
    mode === 'direct'
      ? `直连生效中 · 直接连接 ${list.find((x) => x.id === activeId)?.name ?? '—'}`
      : mode === 'route'
        ? proxyOn
          ? '路由生效中 · 经本地 Proxy 转发'
          : '路由模式 · 请先打开 Proxy'
        : '聚合模式 · 多家模型出现在同一选择器'

  return (
    <>
      <div className="toolbar" onClick={() => setMenuId(null)}>
        <div className="seg">
          <button
            type="button"
            data-on={mode === 'direct'}
            data-mode="direct"
            onClick={() => setMode('direct')}
          >
            <span className="dot" />
            <Plug style={{ width: 13, height: 13 }} strokeWidth={1.8} />
            直连
          </button>
          <button
            type="button"
            data-on={mode === 'route'}
            data-mode="route"
            onClick={() => setMode('route')}
          >
            <span className="dot" />
            <Route style={{ width: 13, height: 13 }} strokeWidth={1.8} />
            路由
          </button>
          <button
            type="button"
            data-on={mode === 'stack'}
            data-mode="stack"
            onClick={() => setMode('stack')}
          >
            <span className="dot" />
            <Layers style={{ width: 13, height: 13 }} strokeWidth={1.8} />
            聚合
          </button>
        </div>
        <span className="hint">{modeHint}</span>
        {mode === 'route' && (
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 'auto' }}
            onClick={() =>
              toast(proxyOn ? '已开始路由' : '请先打开顶栏 Proxy')
            }
          >
            开始路由
          </button>
        )}
        {mode === 'stack' && (
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 'auto' }}
            onClick={() => toast('已切换到聚合')}
          >
            切换到聚合
          </button>
        )}
      </div>

      <div className="content" onClick={() => setMenuId(null)}>
        {shown.map((p, idx) => {
          const current = mode === 'stack' ? !!p.inStack : activeId === p.id
          const onClass =
            current && mode === 'direct'
              ? ' on-direct'
              : current && mode === 'route'
                ? ' on-route'
                : current && mode === 'stack'
                  ? ' on-stack'
                  : ''

          return (
            <div key={p.id} className={`p-card${onClass}`}>
              <div className="ico" style={{ background: p.iconBg }}>
                {p.iconLabel}
              </div>
              <div className="body">
                <div className="name">
                  {p.name}
                  {p.chip && <span className="chip">{p.chip}</span>}
                  {mode === 'stack' && p.isDefault && (
                    <span className="chip">默认</span>
                  )}
                </div>
                <div className="url">{p.endpoint}</div>
              </div>

              {p.usage && <div className="usage">{p.usage}</div>}

              {current && mode !== 'stack' ? (
                <span className="status">
                  <i />
                  使用中
                </span>
              ) : null}

              <div
                className={`actions${menuId === p.id ? ' open' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="btn icon"
                  title={mode === 'stack' ? (current ? '移除' : '添加') : '启用'}
                  onClick={() => {
                    if (mode === 'stack') {
                      setList((xs) =>
                        xs.map((x) =>
                          x.id === p.id ? { ...x, inStack: !x.inStack } : x,
                        ),
                      )
                      toast(current ? '已移出聚合' : '已加入聚合')
                    } else {
                      setActiveId(p.id)
                      toast(mode === 'route' ? `路由到 ${p.name}` : `已启用 ${p.name}`)
                    }
                  }}
                >
                  <Play style={{ width: 15, height: 15 }} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  className="btn icon"
                  title="上移"
                  disabled={idx === 0}
                  onClick={() => move(p.id, -1)}
                >
                  <ArrowUp style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className="btn icon"
                  title="下移"
                  disabled={idx === shown.length - 1}
                  onClick={() => move(p.id, 1)}
                >
                  <ArrowDown style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className="btn icon"
                  title="编辑"
                  onClick={() => setEditId(p.id)}
                >
                  <Pencil style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                </button>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="btn icon"
                    title="更多"
                    onClick={() => setMenuId(menuId === p.id ? null : p.id)}
                  >
                    <MoreHorizontal style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                  </button>
                  {menuId === p.id && (
                    <div className="menu">
                      {mode === 'stack' && current && !p.isDefault && (
                        <button
                          type="button"
                          onClick={() => {
                            setList((xs) =>
                              xs.map((x) => ({ ...x, isDefault: x.id === p.id })),
                            )
                            setMenuId(null)
                            toast('已设为默认')
                          }}
                        >
                          设为默认
                        </button>
                      )}
                      <MenuRow
                        icon={<Copy style={{ width: 14, height: 14 }} />}
                        label="复制"
                        onClick={() => {
                          setList((xs) => [
                            ...xs,
                            {
                              ...p,
                              id: p.id + '-c',
                              name: p.name + ' 副本',
                              isDefault: false,
                            },
                          ])
                          setMenuId(null)
                          toast('已复制')
                        }}
                      />
                      <MenuRow
                        icon={
                          testing === p.id ? (
                            <Loader2
                              style={{ width: 14, height: 14 }}
                              className="animate-spin"
                            />
                          ) : (
                            <Gauge style={{ width: 14, height: 14 }} />
                          )
                        }
                        label="检测连通"
                        onClick={() => test(p)}
                      />
                      <MenuRow
                        icon={<BarChart3 style={{ width: 14, height: 14 }} />}
                        label="配置用量查询"
                        onClick={() => {
                          setUsageId(p.id)
                          setMenuId(null)
                        }}
                      />
                      <MenuRow
                        icon={<Terminal style={{ width: 14, height: 14 }} />}
                        label="打开终端"
                        onClick={() => {
                          setMenuId(null)
                          toast('打开终端')
                        }}
                      />
                      <hr />
                      <MenuRow
                        icon={<Trash2 style={{ width: 14, height: 14 }} />}
                        label="删除"
                        danger
                        onClick={() => {
                          setList((xs) => xs.filter((x) => x.id !== p.id))
                          setMenuId(null)
                          toast('已删除')
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* silent app switcher for demos that still call onAgentChange */}
        <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>
          当前应用 {APPS.find((a) => a.id === agent)?.label}
          {' · '}
          <button
            type="button"
            className="btn ghost"
            style={{ padding: '2px 6px', fontSize: 11.5 }}
            onClick={() => {
              const i = APPS.findIndex((a) => a.id === agent)
              const next = APPS[(i + 1) % APPS.length]!
              onAgentChange(next.id)
              toast(next.label)
            }}
          >
            切换应用
          </button>
        </div>
      </div>

      {addOpen && (
        <Overlay title="添加供应商" onClose={() => setAddOpen(false)}>
          <p className="muted" style={{ fontSize: 12.5, margin: '0 0 12px' }}>
            选择预设或创建自定义
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {PRESETS.map((name) => (
              <button
                key={name}
                type="button"
                className="btn"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => {
                  setList((xs) => [
                    ...xs,
                    {
                      id: 'n' + Date.now(),
                      name,
                      endpoint: 'https://api.example.com',
                      iconBg: '#64748b',
                      iconLabel: name[0]!,
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
        </Overlay>
      )}

      {editId && (
        <Overlay
          title={`编辑 · ${list.find((x) => x.id === editId)?.name}`}
          onClose={() => setEditId(null)}
        >
          <label className="field">
            <span>名称</span>
            <input defaultValue={list.find((x) => x.id === editId)?.name} />
          </label>
          <label className="field">
            <span>Base URL</span>
            <input defaultValue={list.find((x) => x.id === editId)?.endpoint} />
          </label>
          <label className="field">
            <span>API Key</span>
            <input defaultValue="sk-••••••••" />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn ghost" onClick={() => setEditId(null)}>
              取消
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setEditId(null)
                toast('已保存')
              }}
            >
              保存
            </button>
          </div>
        </Overlay>
      )}

      {usageId && (
        <Overlay title="配置用量查询" onClose={() => setUsageId(null)}>
          {['官方订阅额度', 'Coding Plan', '账户余额', '自定义脚本'].map((opt) => (
            <button
              key={opt}
              type="button"
              className="btn"
              style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6 }}
              onClick={() => {
                setUsageId(null)
                toast(opt)
              }}
            >
              {opt}
            </button>
          ))}
        </Overlay>
      )}
    </>
  )
}

function MenuRow({
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
    <button type="button" className={danger ? 'danger' : undefined} onClick={onClick}>
      {icon}
      {label}
    </button>
  )
}

function Overlay({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}
