import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Copy,
  Gauge,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Terminal,
  Trash2,
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
  usage?: string
  latency?: number | null
  inStack?: boolean
  isDefault?: boolean
}

const SEED: Provider[] = [
  { id: 'anthropic', name: 'Anthropic', notes: 'Claude 官方订阅', endpoint: 'api.anthropic.com', iconBg: '#d97706', iconLabel: 'A', usage: '5h · 剩余 68%', latency: 186 },
  { id: 'openai', name: 'OpenAI', notes: 'ChatGPT Plus', endpoint: 'api.openai.com', iconBg: '#10a37f', iconLabel: 'O', usage: '本月 $12.4', latency: 142, inStack: true, isDefault: true },
  { id: 'deepseek', name: 'DeepSeek', notes: '编码 / 推理', endpoint: 'api.deepseek.com', iconBg: '#4f6bed', iconLabel: 'D', usage: '余额 ¥86', latency: 98, inStack: true },
  { id: 'glm', name: '智谱 GLM', notes: 'Coding Plan', endpoint: 'open.bigmodel.cn', iconBg: '#7c5cbf', iconLabel: '智', usage: '未查询', latency: null },
  { id: 'kimi', name: 'Kimi', notes: '长上下文', endpoint: 'api.moonshot.cn', iconBg: '#0d9488', iconLabel: 'K', usage: '剩余 42%', latency: 210, inStack: true },
  { id: 'silicon', name: 'SiliconFlow', notes: '自定义中转', endpoint: 'api.siliconflow.cn', iconBg: '#64748b', iconLabel: 'S', usage: '¥23.5', latency: 156 },
]

const PRESETS = ['Anthropic', 'OpenAI', 'DeepSeek', '智谱', 'Moonshot', 'SiliconFlow', 'OpenRouter', '自定义']

export function ProvidersView({
  agent,
  onAgentChange,
}: {
  agent: AgentId
  onAgentChange: (id: AgentId) => void
}) {
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>('route')
  const [list, setList] = useState(SEED)
  const [activeId, setActiveId] = useState('deepseek')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [usageId, setUsageId] = useState<string | null>(null)

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
      const ms = 80 + Math.floor(Math.random() * 160)
      setList((xs) => xs.map((x) => (x.id === p.id ? { ...x, latency: ms } : x)))
      setTesting(null)
      toast(`${p.name} · ${ms} ms`)
    }, 700)
  }

  return (
    <div className="page" onClick={() => setMenuId(null)}>
      <div className="page-head">
        <h1>供应商</h1>
        <p>
          {AGENTS.find((a) => a.id === agent)?.label} ·
          {mode === 'direct' ? ' 直连' : mode === 'route' ? ' 路由队列' : ' 聚合成员'}
        </p>
        <select
          value={agent}
          onChange={(e) => onAgentChange(e.target.value as AgentId)}
          style={{
            border: '1px solid var(--line)',
            background: '#fff',
            borderRadius: 8,
            font: 'inherit',
            fontSize: 12,
            padding: '4px 8px',
            color: 'var(--fg-2)',
          }}
        >
          {AGENTS.filter((a) => a.installed).map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
        <div className="seg">
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
              data-on={mode === id}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="btn primary" onClick={() => setAddOpen(true)}>
          <Plus style={{ width: 14, height: 14 }} />
          添加
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shown.map((p, idx) => {
          const current = mode === 'stack' ? !!p.inStack : activeId === p.id
          return (
            <div
              key={p.id}
              className={`provider-card${current && mode !== 'stack' ? ' on' : ''}`}
              style={
                mode === 'stack' && current
                  ? { borderColor: '#7c3aed', background: '#faf8ff' }
                  : undefined
              }
            >
              <div className="ico" style={{ background: p.iconBg }}>
                {p.iconLabel}
              </div>
              <div className="meta">
                <div className="name">
                  {p.name}
                  {mode === 'stack' && p.isDefault && (
                    <span className="pill soft">默认</span>
                  )}
                  {current && mode !== 'stack' && (
                    <span className="muted" style={{ fontWeight: 450, fontSize: 12 }}>
                      · {mode === 'route' ? '当前路由' : '使用中'}
                    </span>
                  )}
                </div>
                <div className="sub">
                  {p.notes} · {p.endpoint}
                  {p.usage ? ` · ${p.usage}` : ''}
                  {p.latency != null ? ` · ${p.latency} ms` : ''}
                </div>
              </div>

              <div className="actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    if (mode === 'stack') {
                      setList((xs) =>
                        xs.map((x) =>
                          x.id === p.id ? { ...x, inStack: !x.inStack } : x,
                        ),
                      )
                      toast(current ? `已移出聚合` : `已加入聚合`)
                    } else {
                      setActiveId(p.id)
                      toast(mode === 'route' ? `路由到 ${p.name}` : `已启用 ${p.name}`)
                    }
                  }}
                >
                  {mode === 'stack' ? (current ? '移除' : '添加') : current ? '当前' : '启用'}
                </button>
                <button
                  type="button"
                  className="btn quiet"
                  title="上移"
                  disabled={idx === 0}
                  onClick={() => move(p.id, -1)}
                >
                  <ArrowUp style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className="btn quiet"
                  title="下移"
                  disabled={idx === shown.length - 1}
                  onClick={() => move(p.id, 1)}
                >
                  <ArrowDown style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className="btn quiet"
                  title="编辑"
                  onClick={() => setEditId(p.id)}
                >
                  <Pencil style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    className="btn quiet"
                    title="更多"
                    onClick={() => setMenuId(menuId === p.id ? null : p.id)}
                  >
                    <MoreHorizontal style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                  </button>
                  {menuId === p.id && (
                    <div className="more-menu">
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
                            { ...p, id: p.id + '-c', name: p.name + ' 副本', isDefault: false },
                          ])
                          setMenuId(null)
                          toast('已复制')
                        }}
                      />
                      <MenuRow
                        icon={
                          testing === p.id ? (
                            <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />
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
      </div>

      {addOpen && (
        <Overlay onClose={() => setAddOpen(false)} title="添加供应商">
          <p className="muted" style={{ fontSize: 12.5, margin: '0 0 12px' }}>
            选一个预设，填 Key 即可。
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
                      notes: '新添加',
                      endpoint: 'api.example.com',
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
            <input defaultValue={'https://' + (list.find((x) => x.id === editId)?.endpoint ?? '')} />
          </label>
          <label className="field">
            <span>API Key</span>
            <input defaultValue="sk-••••••••" />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
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
        <Overlay
          title="配置用量查询"
          onClose={() => setUsageId(null)}
        >
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
    </div>
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}
