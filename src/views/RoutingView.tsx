import { useState } from 'react'
import { Bot, EyeOff, Plus, Radio } from 'lucide-react'
import { AGENTS, STRATEGIES, type AgentId, type StrategyId } from '../lib/types'
import { useToast } from '../lib/toast'

type Target = {
  id: string
  name: string
  kind: 'cloud' | 'local' | 'group'
  color: string
  rule: string
  badge?: string
  used?: string
}

const TARGETS: Target[] = [
  { id: 'opus', name: 'claude-opus-4', kind: 'cloud', color: '#d97706', rule: '默认 · 规则都不中时', badge: '默认', used: '32%' },
  { id: 'deepseek', name: 'deepseek-v3', kind: 'cloud', color: '#4f6bed', rule: '意图 · 简单询问', used: '18%' },
  { id: 'glm', name: 'glm-4.6', kind: 'cloud', color: '#7c5cbf', rule: '意图 · 写/修测试', used: '41%' },
  { id: 'kimi', name: 'kimi-k2', kind: 'cloud', color: '#0d9488', rule: '意图 · 审阅改动', used: '22%' },
  { id: 'tts', name: '本地 TTS', kind: 'local', color: '#059669', rule: '本地 Pack · 文本转语音', badge: 'Pack' },
  { id: 'asr', name: '本地 ASR', kind: 'local', color: '#0f766e', rule: '本地 Pack · 语音识别', badge: 'Pack' },
  { id: 'align', name: '字幕对齐', kind: 'local', color: '#0891b2', rule: '本地 Pack · 时间轴', badge: 'Pack' },
  { id: 'ffmpeg', name: 'FFmpeg 剪辑', kind: 'local', color: '#b45309', rule: '本地 Pack · 剪辑管线', badge: 'Pack' },
  { id: 'remotion', name: 'Remotion 打包', kind: 'local', color: '#be123c', rule: '本地 Pack · 成片导出', badge: 'Pack' },
  { id: 'reach', name: 'ReachFlow 爬取', kind: 'local', color: '#7c3aed', rule: '本地 Pack · 网页抓取', badge: 'Pack' },
  { id: 'nested', name: 'group/省钱组', kind: 'group', color: '#475569', rule: '嵌套组 · 智能', badge: '组' },
]

const TRACE = [
  { t: '13:41:02', who: 'Claude Code', what: '新一轮 · 意图=编写测试', dest: 'glm-4.6', why: '规则 #2 命中' },
  { t: '13:40:18', who: 'Codex', what: '跟绑上一轮', dest: 'deepseek-v3', why: '亲和 4 分钟内' },
  { t: '13:38:55', who: 'WorkBuddy', what: 'TTS 请求', dest: '本地 TTS', why: 'Pack 目标' },
  { t: '13:36:11', who: 'Claude Code', what: '额度 96% · 跳过', dest: 'deepseek-v3', why: '智能：Opus 接近用尽' },
]

const RULES = [
  { id: 1, when: '简单询问 / 解释', dest: 'deepseek-v3' },
  { id: 2, when: '编写或修复测试', dest: 'glm-4.6' },
  { id: 3, when: '审阅 diff / 重构', dest: 'kimi-k2' },
  { id: 4, when: '剪辑 / 配音 / 字幕', dest: '视频 Pack' },
  { id: 5, when: '爬取网页内容', dest: 'ReachFlow' },
]

export function RoutingView({ agent }: { agent: AgentId }) {
  const { toast } = useToast()
  const [strategy, setStrategy] = useState<StrategyId>('intent')
  const [selected, setSelected] = useState('opus')
  const [tab, setTab] = useState<'flow' | 'rules' | 'trace'>('flow')
  const [mask, setMask] = useState(false)
  const [live, setLive] = useState(true)
  const current = AGENTS.find((a) => a.id === agent)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#ebebef] px-3 py-2">
        <div className="seg-track flex">
          {(
            [
              ['flow', '节点流'],
              ['rules', '意图规则'],
              ['trace', '决策轨迹'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`seg-item rounded-[6px] px-2.5 py-[4px] text-[11.5px] ${
                tab === id
                  ? 'bg-white font-medium text-[#1a1a1c] shadow-sm'
                  : 'text-[#6b6b76]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLive((v) => !v)}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] ${
              live ? 'bg-[#e8f8ee] text-[#0f7a3f]' : 'bg-[#f3f3f5] text-[#6b6b76]'
            }`}
          >
            <Radio className="h-3 w-3" />
            {live ? '实时' : '暂停'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMask((v) => !v)
              toast(mask ? '已显示账号' : '已隐藏账号（截图用）')
            }}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] ${
              mask ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#f3f3f5] text-[#6b6b76]'
            }`}
          >
            <EyeOff className="h-3 w-3" />
            {mask ? '已隐藏账号' : '隐藏账号'}
          </button>
        </div>
      </div>

      {tab === 'flow' && (
        <div className="flex min-h-0 flex-1">
          {/* left agents */}
          <div className="w-[148px] shrink-0 border-r border-[#ebebef] p-2">
            <div className="mb-1.5 px-1 text-[10px] font-medium tracking-wider text-[#9c9ca8]">
              AGENTS
            </div>
            {AGENTS.filter((a) => a.installed).map((a) => (
              <div
                key={a.id}
                className={`mb-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11.5px] ${
                  a.id === agent
                    ? 'bg-white font-medium text-[#1a1a1c] shadow-sm ring-1 ring-[#ebebef]'
                    : 'text-[#5c5c66]'
                }`}
              >
                <Bot className="h-3.5 w-3.5 text-[#2f6fed]" />
                <span className="truncate">{a.label}</span>
              </div>
            ))}
            <div className="mt-3 rounded-lg border border-dashed border-[#d4d4dc] px-2 py-2 text-[10.5px] leading-snug text-[#6b6b76]">
              当前 {current?.label}
              <br />
              方案会记住每个 Agent 的模型短名单
            </div>
          </div>

          {/* center gateway */}
          <div className="flex w-[210px] shrink-0 flex-col items-center justify-center border-r border-[#ebebef] bg-[#fcfcfd] px-3">
            <div className="mb-2 text-[10px] tracking-wider text-[#9c9ca8]">GATEWAY</div>
            <div className="w-full rounded-2xl border border-[#dbeafe] bg-gradient-to-b from-white to-[#f4f8ff] px-3 py-3 text-center shadow-sm">
              <div className="text-[13px] font-semibold text-[#1a1a1c]">PackGate</div>
              <div className="mt-0.5 text-[10.5px] text-[#6b6b76]">127.0.0.1:3425</div>
              <div className="mt-2 text-[10.5px] leading-snug text-[#3a3a42]">
                {STRATEGIES.find((s) => s.id === strategy)?.helper}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStrategy(s.id)
                    toast(`策略：${s.label}`)
                  }}
                  className={`rounded-full px-2 py-[3px] text-[10.5px] ${
                    strategy === s.id
                      ? 'bg-[#2f6fed] text-white'
                      : 'bg-[#f3f3f5] text-[#5c5c66] hover:bg-[#e8e8ee]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* right targets */}
          <div className="min-w-0 flex-1 overflow-y-auto p-2">
            <div className="mb-1.5 flex items-center px-1">
              <span className="text-[10px] font-medium tracking-wider text-[#9c9ca8]">
                目标
              </span>
              <button
                type="button"
                className="ml-auto flex items-center gap-0.5 text-[11px] text-[#2f6fed]"
                onClick={() => toast('添加目标（Demo）')}
              >
                <Plus className="h-3 w-3" />
                添加
              </button>
            </div>
            <div className="space-y-1">
              {TARGETS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-selected={selected === t.id}
                  onClick={() => {
                    setSelected(t.id)
                    toast(`本轮绑定：${t.name}`)
                  }}
                  className="target-row flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: t.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[12px] font-medium text-[#1a1a1c]">
                        {mask && t.kind === 'cloud' ? '••••' : t.name}
                      </span>
                      {t.badge && (
                        <span className="rounded bg-[#f3f3f5] px-1 text-[9px] text-[#6b6b76]">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[10.5px] text-[#8a8a96]">{t.rule}</div>
                  </div>
                  {t.used && (
                    <span className="text-[10.5px] text-[#6b6b76]">{t.used}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'rules' && (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="mb-2 text-[12px] text-[#6b6b76]">
            意图路由：小模型读每一轮新消息，命中规则则把该轮（含后续 tool）绑到目标。
          </div>
          {RULES.map((r) => (
            <div
              key={r.id}
              className="mb-2 flex items-center gap-3 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5"
            >
              <span className="w-6 text-[11px] font-semibold text-[#9c9ca8]">
                #{r.id}
              </span>
              <span className="flex-1 text-[12.5px] text-[#1a1a1c]">{r.when}</span>
              <span className="rounded-full bg-[#f0f7ff] px-2 py-[2px] text-[11px] text-[#1e40af]">
                {r.dest}
              </span>
              <button
                type="button"
                className="text-[11px] text-[#6b6b76] hover:text-[#1a1a1c]"
                onClick={() => toast(`编辑规则 #${r.id}`)}
              >
                编辑
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => toast('新增意图规则（Demo）')}
            className="mt-1 flex items-center gap-1 rounded-lg border border-dashed border-[#d4d4dc] px-3 py-2 text-[12px] text-[#2f6fed]"
          >
            <Plus className="h-3.5 w-3.5" />
            添加规则
          </button>
        </div>
      )}

      {tab === 'trace' && (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {TRACE.map((row, i) => (
            <div
              key={i}
              className="mb-2 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5"
            >
              <div className="flex items-center gap-2 text-[11px] text-[#6b6b76]">
                <span className="font-mono">{row.t}</span>
                <span className="font-medium text-[#1a1a1c]">{row.who}</span>
                <span className="ml-auto rounded bg-[#f0f7ff] px-1.5 py-[1px] text-[#1e40af]">
                  {row.dest}
                </span>
              </div>
              <div className="mt-1 text-[12px] text-[#3a3a42]">{row.what}</div>
              <div className="mt-0.5 text-[11px] text-[#8a8a96]">{row.why}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
