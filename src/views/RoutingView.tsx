import { useMemo, useState } from 'react'
import { Bot, Plus, Server } from 'lucide-react'
import { STRATEGIES, type StrategyId, type AgentId, AGENTS } from '../lib/types'
import { useToast } from '../lib/toast'

type Target = {
  id: string
  name: string
  kind: 'cloud' | 'local'
  color: string
  rule: string
  badge?: string
}

const TARGETS: Target[] = [
  {
    id: 'claude-opus',
    name: 'claude-opus-4',
    kind: 'cloud',
    color: '#f97316',
    rule: '第一个，规则都不匹配时用它（默认 / 回退）',
    badge: '默认',
  },
  {
    id: 'deepseek',
    name: 'deepseek-v3',
    kind: 'cloud',
    color: '#3b82f6',
    rule: '意图 · 简单询问',
  },
  {
    id: 'glm',
    name: 'glm-4.6',
    kind: 'cloud',
    color: '#8b5cf6',
    rule: '意图 · 编写或修复测试',
  },
  {
    id: 'kimi',
    name: 'kimi-k2',
    kind: 'cloud',
    color: '#0ea5e9',
    rule: '意图 · 审阅改动',
  },
  {
    id: 'tts',
    name: '本地 TTS',
    kind: 'local',
    color: '#10b981',
    rule: '本地 Pack · 文本转语音',
    badge: 'Pack',
  },
  {
    id: 'asr',
    name: '本地 ASR',
    kind: 'local',
    color: '#14b8a6',
    rule: '本地 Pack · 语音识别',
    badge: 'Pack',
  },
  {
    id: 'align',
    name: '字幕对齐',
    kind: 'local',
    color: '#06b6d4',
    rule: '本地 Pack · 字幕时间轴对齐',
    badge: 'Pack',
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg 剪辑',
    kind: 'local',
    color: '#f59e0b',
    rule: '本地 Pack · 视频剪辑管线',
    badge: 'Pack',
  },
  {
    id: 'remotion',
    name: 'Remotion 打包',
    kind: 'local',
    color: '#ef4444',
    rule: '本地 Pack · 程序化视频渲染',
    badge: 'Pack',
  },
  {
    id: 'reachflow',
    name: 'ReachFlow 爬取',
    kind: 'local',
    color: '#6366f1',
    rule: '本地 Pack · 内容爬取与抽取',
    badge: 'Pack',
  },
  {
    id: 'video-pack',
    name: 'Video Pack',
    kind: 'local',
    color: '#2563eb',
    rule: '组合包 · 多模态视频工作流',
    badge: '组合',
  },
]

export function RoutingView({ agent }: { agent: AgentId }) {
  const { toast } = useToast()
  const [strategy, setStrategy] = useState<StrategyId>('intent')
  const [selected, setSelected] = useState('claude-opus')
  const agentLabel = AGENTS.find((a) => a.id === agent)?.label ?? agent
  const helper = STRATEGIES.find((s) => s.id === strategy)!.helper
  const selectedTarget = TARGETS.find((t) => t.id === selected)!

  const cloud = useMemo(() => TARGETS.filter((t) => t.kind === 'cloud'), [])
  const local = useMemo(() => TARGETS.filter((t) => t.kind === 'local'), [])

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden p-4">
      {/* Strategy tabs */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="seg-scroll flex max-w-full gap-0.5 overflow-x-auto rounded-lg bg-slate-100 p-0.5">
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setStrategy(s.id)
                toast(`路由策略：${s.label}`)
              }}
              className={`shrink-0 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition ${
                strategy === s.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-slate-500">
          {helper}
        </p>
      </div>

      {/* Flow diagram */}
      <div className="relative min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4">
        <div className="flex min-h-[320px] items-stretch gap-2">
          {/* Left: Agent */}
          <div className="flex w-[120px] shrink-0 flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => toast(`入口 Agent：${agentLabel}`)}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-4 shadow-sm transition hover:border-blue-300 hover:shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                <Bot className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="text-[12px] font-semibold text-slate-800">
                  {agentLabel}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">工具结果</div>
              </div>
            </button>
          </div>

          {/* Connector to gateway */}
          <div className="relative flex w-10 shrink-0 items-center">
            <div className="h-px w-full border-t border-dashed border-slate-300" />
          </div>

          {/* Center: Gateway */}
          <div className="flex w-[140px] shrink-0 flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => toast('PackGate 本地网关 · localhost:3425')}
              className="relative flex w-full flex-col items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-3 py-5 shadow-md transition hover:border-blue-400"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Server className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="text-[13px] font-bold text-slate-900">PackGate</div>
                <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                  localhost:3425
                </div>
              </div>
              <span className="absolute -bottom-2.5 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">
                同一轮
              </span>
            </button>
          </div>

          {/* Connectors + targets */}
          <div className="relative ml-2 min-w-0 flex-1">
            <div className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              云模型
            </div>
            <div className="flex flex-col gap-1.5">
              {cloud.map((t) => (
                <TargetRow
                  key={t.id}
                  target={t}
                  selected={selected === t.id}
                  onSelect={() => {
                    setSelected(t.id)
                    toast(`已选目标：${t.name}`)
                  }}
                />
              ))}
            </div>

            <div className="mt-3 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              本地 Pack
            </div>
            <div className="flex flex-col gap-1.5">
              {local.map((t) => (
                <TargetRow
                  key={t.id}
                  target={t}
                  selected={selected === t.id}
                  onSelect={() => {
                    setSelected(t.id)
                    toast(`已选本地目标：${t.name}`)
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => toast('Demo：添加路由目标')}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-blue-300 bg-blue-50/40 py-2 text-[12px] text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-3.5 w-3.5" />
              添加目标
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-2">
        <p className="max-w-xl text-[12px] leading-relaxed text-slate-500">
          工具结果作为后续请求回来——不是新问题，所以留在{' '}
          <span className="font-medium text-slate-700">{selectedTarget.name}</span>
          。当前策略「{STRATEGIES.find((s) => s.id === strategy)!.label}」下：
          {selectedTarget.rule}
        </p>
        <div className="flex gap-4 text-right">
          {[
            { n: '1', l: '轮对话' },
            { n: '1', l: '次意图分类' },
            { n: '1', l: '工具轮次留原模型' },
          ].map((m) => (
            <div key={m.l}>
              <div className="text-lg font-semibold tabular-nums text-slate-800">
                {m.n}
              </div>
              <div className="text-[10px] text-slate-400">{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TargetRow({
  target,
  selected,
  onSelect,
}: {
  target: Target
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
        selected
          ? 'border-slate-300 bg-white shadow-sm ring-1 ring-slate-200'
          : 'border-transparent bg-white/70 hover:border-slate-200 hover:bg-white'
      }`}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full border-2 ${
          selected ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-white'
        }`}
      />
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: target.color }}
      />
      <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-slate-800">
        {target.name}
      </span>
      {target.badge && (
        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
          {target.badge}
        </span>
      )}
      <span className="hidden max-w-[40%] truncate text-[11px] text-slate-400 sm:inline">
        {target.rule}
      </span>
    </button>
  )
}
