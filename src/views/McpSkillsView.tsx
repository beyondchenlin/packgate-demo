import { useState } from 'react'
import { useToast } from '../lib/toast'

type Item = {
  id: string
  name: string
  kind: 'MCP' | 'Skill'
  desc: string
  enabled: boolean
}

const INITIAL: Item[] = [
  { id: '1', name: 'filesystem', kind: 'MCP', desc: '本地文件系统读写', enabled: true },
  { id: '2', name: 'reachflow', kind: 'MCP', desc: 'ReachFlow 爬取服务（Pack 安装后注册）', enabled: false },
  { id: '3', name: 'ffmpeg-edit', kind: 'MCP', desc: 'FFmpeg 剪辑工具集', enabled: false },
  { id: '4', name: 'local-tts', kind: 'MCP', desc: '本地 TTS 服务端点', enabled: true },
  { id: '5', name: 'video-pipeline', kind: 'Skill', desc: '视频多模态编排 Skill', enabled: true },
  { id: '6', name: 'subtitle-align', kind: 'Skill', desc: '字幕对齐工作流', enabled: false },
  { id: '7', name: 'remotion-render', kind: 'Skill', desc: 'Remotion 渲染 Skill', enabled: false },
]

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`toggle-track relative h-[18px] w-[32px] shrink-0 rounded-full ${
        on ? 'bg-[#1a1a1c]' : 'bg-[#d8d8de]'
      }`}
    >
      <span
        className={`toggle-thumb absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm ${
          on ? 'translate-x-[14px]' : ''
        }`}
      />
    </button>
  )
}

export function McpSkillsView() {
  const { toast } = useToast()
  const [items, setItems] = useState(INITIAL)
  const [tab, setTab] = useState<'all' | 'MCP' | 'Skill'>('all')
  const filtered = items.filter((i) => tab === 'all' || i.kind === tab)

  return (
    <div className="view-fade h-full overflow-auto bg-[#fafafa] p-4">
      <div className="mb-3.5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-[14px] font-semibold tracking-tight text-[#1a1a1c]">MCP / Skills</h2>
          <p className="mt-0.5 text-[11.5px] text-[#8a8a96]">统一注册进网关后端，不写进 Agent 配置文件。</p>
        </div>
        <div className="seg-track flex gap-0">
          {(['all', 'MCP', 'Skill'] as const).map((t) => (
            <button
              key={t}
              type="button"
              data-active={tab === t}
              onClick={() => setTab(t)}
              className={`seg-item rounded-[6px] px-2.5 py-[5px] text-[11.5px] ${
                tab === t ? 'font-medium text-[#1a1a1c]' : 'text-[#6b6b76]'
              }`}
            >
              {t === 'all' ? '全部' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[12px] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)]">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-3.5 py-2.5 ${
              i < filtered.length - 1 ? 'border-b border-[#f0f0f3]' : ''
            }`}
          >
            <span
              className={`rounded-[4px] px-1.5 py-[1px] text-[9.5px] font-medium ${
                item.kind === 'MCP'
                  ? 'bg-[#f3f0fa] text-[#5b4a8a]'
                  : 'bg-[#faf4ec] text-[#8a6230]'
              }`}
            >
              {item.kind}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-medium tracking-tight text-[#1a1a1c]">{item.name}</div>
              <div className="text-[11px] text-[#8a8a96]">{item.desc}</div>
            </div>
            <button
              type="button"
              onClick={() => toast(`Demo：配置 ${item.name}`)}
              className="rounded-[6px] bg-[#f4f4f6] px-2 py-[4px] text-[11px] text-[#5c5c66] hover:bg-[#ececef]"
            >
              配置
            </button>
            <Toggle
              on={item.enabled}
              onClick={() => {
                setItems((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, enabled: !x.enabled } : x)),
                )
                toast(item.enabled ? `已禁用 ${item.name}` : `已启用 ${item.name}`)
              }}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => toast('Demo：添加 MCP / Skill')}
        className="mt-2.5 w-full rounded-[10px] border border-dashed border-[#d8d8de] py-2.5 text-[11.5px] text-[#8a8a96] hover:border-[#b8c8f0] hover:text-[#4a6fd4]"
      >
        + 添加 MCP 或 Skill
      </button>
    </div>
  )
}
