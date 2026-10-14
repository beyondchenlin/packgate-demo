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
  {
    id: '1',
    name: 'filesystem',
    kind: 'MCP',
    desc: '本地文件系统读写',
    enabled: true,
  },
  {
    id: '2',
    name: 'reachflow',
    kind: 'MCP',
    desc: 'ReachFlow 爬取服务（Pack 安装后注册）',
    enabled: false,
  },
  {
    id: '3',
    name: 'ffmpeg-edit',
    kind: 'MCP',
    desc: 'FFmpeg 剪辑工具集',
    enabled: false,
  },
  {
    id: '4',
    name: 'local-tts',
    kind: 'MCP',
    desc: '本地 TTS 服务端点',
    enabled: true,
  },
  {
    id: '5',
    name: 'video-pipeline',
    kind: 'Skill',
    desc: '视频多模态编排 Skill',
    enabled: true,
  },
  {
    id: '6',
    name: 'subtitle-align',
    kind: 'Skill',
    desc: '字幕对齐工作流',
    enabled: false,
  },
  {
    id: '7',
    name: 'remotion-render',
    kind: 'Skill',
    desc: 'Remotion 渲染 Skill',
    enabled: false,
  },
]

export function McpSkillsView() {
  const { toast } = useToast()
  const [items, setItems] = useState(INITIAL)
  const [tab, setTab] = useState<'all' | 'MCP' | 'Skill'>('all')

  const filtered = items.filter((i) => tab === 'all' || i.kind === tab)

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">MCP / Skills</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            统一注册进网关后端（借鉴 CC Switch），不是只写进 Agent 配置文件。
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
          {(['all', 'MCP', 'Skill'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${
                tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              {t === 'all' ? '全部' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              i < filtered.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                item.kind === 'MCP'
                  ? 'bg-violet-50 text-violet-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {item.kind}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-slate-900">{item.name}</div>
              <div className="text-[12px] text-slate-500">{item.desc}</div>
            </div>
            <button
              type="button"
              onClick={() => toast(`Demo：配置 ${item.name}`)}
              className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
            >
              配置
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={item.enabled}
              onClick={() => {
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === item.id ? { ...x, enabled: !x.enabled } : x,
                  ),
                )
                toast(item.enabled ? `已禁用 ${item.name}` : `已启用 ${item.name}`)
              }}
              className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                item.enabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                  item.enabled ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => toast('Demo：添加 MCP / Skill')}
        className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-[12px] text-slate-500 hover:border-blue-300 hover:text-blue-600"
      >
        + 添加 MCP 或 Skill
      </button>
    </div>
  )
}
