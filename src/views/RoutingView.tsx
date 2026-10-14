import { useMemo, useState } from 'react'
import { Bot, Plus } from 'lucide-react'
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
    color: '#d97706',
    rule: '第一个，规则都不匹配时用它',
    badge: '默认',
  },
  {
    id: 'deepseek',
    name: 'deepseek-v3',
    kind: 'cloud',
    color: '#4f6bed',
    rule: '意图 · 简单询问',
  },
  {
    id: 'glm',
    name: 'glm-4.6',
    kind: 'cloud',
    color: '#7c5cbf',
    rule: '意图 · 编写或修复测试',
  },
  {
    id: 'kimi',
    name: 'kimi-k2',
    kind: 'cloud',
    color: '#0d9488',
    rule: '意图 · 审阅改动',
  },
  {
    id: 'tts',
    name: '本地 TTS',
    kind: 'local',
    color: '#059669',
    rule: '本地 Pack · 文本转语音',
    badge: 'Pack',
  },
  {
    id: 'asr',
    name: '本地 ASR',
    kind: 'local',
    color: '#0f766e',
    rule: '本地 Pack · 语音识别',
    badge: 'Pack',
  },
  {
    id: 'align',
    name: '字幕对齐',
    kind: 'local',
    color: '#0891b2',
    rule: '本地 Pack · 字幕时间轴对齐',
    badge: 'Pack',
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg 剪辑',
    kind: 'local',
    color: '#b45309',
    rule: '本地 Pack · 视频剪辑管线',
    badge: 'Pack',
  },
  {
    id: 'remotion',
    name: 'Remotion 打包',
    kind: 'local',
    color: '#b91c1c',
    rule: '本地 Pack · 程序化视频渲染',
    badge: 'Pack',
  },
  {
    id: 'reachflow',
    name: 'ReachFlow 爬取',
    kind: 'local',
    color: '#4f46e5',
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
  const allVisible = [...cloud, ...local]
  const selectedIndex = allVisible.findIndex((t) => t.id === selected)

  return (
    <div className="view-fade flex h-full flex-col gap-3 overflow-hidden bg-[#fafafa] p-4">
      {/* Magpie-style segmented control */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="seg-track seg-scroll flex max-w-full shrink-0 gap-0 overflow-x-auto">
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              type="button"
              data-active={strategy === s.id}
              onClick={() => {
                setStrategy(s.id)
                toast(`路由策略：${s.label}`)
              }}
              className={`seg-item shrink-0 rounded-[6px] px-2.5 py-[5px] text-[12px] tracking-tight ${
                strategy === s.id
                  ? 'font-medium text-[#1a1a1c]'
                  : 'font-normal text-[#6b6b76] hover:text-[#3a3a42]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="min-w-0 flex-1 text-[11.5px] leading-[1.45] text-[#8a8a96]">
          {helper}
        </p>
      </div>

      {/* Flow canvas */}
      <div className="flow-canvas relative min-h-0 flex-1 overflow-auto p-5">
        <div className="relative mx-auto flex min-h-[300px] max-w-[720px] items-center gap-0">
          {/* Left: Agent */}
          <div className="relative z-10 flex w-[108px] shrink-0 flex-col items-center">
            <button
              type="button"
              onClick={() => toast(`入口 Agent：${agentLabel}`)}
              className="agent-node flex w-full flex-col items-center gap-2 rounded-[12px] bg-white px-2.5 py-3.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#fff7ed]">
                <Bot className="h-[18px] w-[18px] text-[#c2410c]" strokeWidth={1.75} />
              </div>
              <div className="text-center">
                <div className="text-[11.5px] font-semibold tracking-tight text-[#1a1a1c]">
                  {agentLabel}
                </div>
                <div className="mt-0.5 text-[10px] text-[#9c9ca8]">工具结果</div>
              </div>
            </button>
          </div>

          {/* SVG connectors */}
          <div className="relative z-0 flex min-w-0 flex-1 items-center self-stretch px-1">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M 0 50 L 28 50"
                fill="none"
                stroke="#c5c5ce"
                strokeWidth="0.35"
                strokeDasharray="1.2 1"
              />
              {allVisible.map((_, i) => {
                const n = allVisible.length
                const y = ((i + 0.5) / n) * 100
                const mid = 50
                const isSel = i === selectedIndex
                return (
                  <path
                    key={i}
                    d={`M 42 ${mid} C 58 ${mid}, 68 ${y}, 100 ${y}`}
                    fill="none"
                    stroke={isSel ? '#8a8a96' : '#d0d0d8'}
                    strokeWidth={isSel ? 0.45 : 0.32}
                    strokeDasharray={isSel ? undefined : '1.2 1'}
                  />
                )
              })}
            </svg>

            {/* Center gateway overlaid */}
            <div className="relative z-10 ml-[26%] flex w-[118px] shrink-0 -translate-x-1/2 flex-col items-center">
              <button
                type="button"
                onClick={() => toast('PackGate 本地网关 · localhost:3425')}
                className="gateway-node relative flex w-full flex-col items-center gap-1.5 rounded-[14px] bg-white px-3 py-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#1a1a1c]">
                  <span className="text-[11px] font-bold tracking-tight text-white">PG</span>
                </div>
                <div className="text-center">
                  <div className="text-[12.5px] font-semibold tracking-tight text-[#1a1a1c]">
                    PackGate
                  </div>
                  <div className="mt-0.5 font-mono text-[9.5px] text-[#9c9ca8]">
                    localhost:3425
                  </div>
                </div>
                <span className="absolute -bottom-[9px] rounded-full bg-[#1a1a1c] px-2 py-[2px] text-[9.5px] font-medium tracking-tight text-white">
                  同一轮
                </span>
              </button>
            </div>
          </div>

          {/* Right: targets */}
          <div className="relative z-10 w-[min(100%,280px)] shrink-0 sm:w-[300px]">
            <div className="mb-1.5 text-[9.5px] font-medium tracking-[0.05em] text-[#b0b0ba]">
              云模型
            </div>
            <div className="flex flex-col gap-[5px]">
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

            <div className="mt-3 mb-1.5 text-[9.5px] font-medium tracking-[0.05em] text-[#b0b0ba]">
              本地 Pack
            </div>
            <div className="flex flex-col gap-[5px]">
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
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-[8px] border border-dashed border-[#b8c8f0] bg-[#f3f6fd] py-[7px] text-[11.5px] text-[#4a6fd4] hover:bg-[#eaf0fc]"
            >
              <Plus className="h-3 w-3" strokeWidth={2} />
              添加目标
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-[#ebebef] pt-2.5">
        <p className="max-w-lg text-[11.5px] leading-[1.5] text-[#8a8a96]">
          工具结果作为后续请求回来——不是新问题，所以留在{' '}
          <span className="font-medium text-[#3a3a42]">{selectedTarget.name}</span>
          。当前策略「{STRATEGIES.find((s) => s.id === strategy)!.label}」：
          {selectedTarget.rule}
        </p>
        <div className="flex gap-5">
          {[
            { n: '1', l: '轮对话' },
            { n: '1', l: '次意图分类' },
            { n: '1', l: '工具轮次留原模型' },
          ].map((m) => (
            <div key={m.l} className="text-right">
              <div className="text-[17px] font-semibold tabular-nums tracking-tight text-[#1a1a1c]">
                {m.n}
              </div>
              <div className="text-[9.5px] text-[#9c9ca8]">{m.l}</div>
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
      data-selected={selected}
      onClick={onSelect}
      className={`target-row flex w-full items-center gap-2 rounded-[8px] border px-2.5 py-[7px] text-left ${
        selected
          ? 'border-[#d8d8de] bg-white'
          : 'border-transparent bg-white/55 hover:border-[#e8e8ee] hover:bg-white/90'
      }`}
    >
      <span
        className={`flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
          selected ? 'border-[#1a1a1c]' : 'border-[#c8c8d0]'
        }`}
      >
        {selected && <span className="h-[5px] w-[5px] rounded-full bg-[#1a1a1c]" />}
      </span>
      <span
        className="h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ backgroundColor: target.color }}
      />
      <span className="min-w-0 flex-1 truncate text-[12px] font-medium tracking-tight text-[#1a1a1c]">
        {target.name}
      </span>
      {target.badge && (
        <span className="shrink-0 rounded-[4px] bg-[#f0f0f3] px-1.5 py-[1px] text-[9.5px] text-[#8a8a96]">
          {target.badge}
        </span>
      )}
      <span className="hidden max-w-[42%] truncate text-[10.5px] text-[#9c9ca8] lg:inline">
        {target.rule}
      </span>
    </button>
  )
}
