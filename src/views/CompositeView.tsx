import { useState } from 'react'
import { useToast } from '../lib/toast'

type Composite = {
  id: string
  modelId: string
  name: string
  desc: string
  enabled: boolean
}

const INITIAL: Composite[] = [
  {
    id: '1',
    modelId: 'packgate/video-mm',
    name: '视频多模态',
    desc: 'Agent 右下角选此模型 → 网关调度云 LLM + 本地剪辑 Pack',
    enabled: true,
  },
  {
    id: '2',
    modelId: 'packgate/local-tts',
    name: '本地 TTS',
    desc: '优先本地 TTS Pack；无云模型时沿用 Agent 自带 LLM',
    enabled: true,
  },
  {
    id: '3',
    modelId: 'packgate/reachflow',
    name: 'ReachFlow 爬取',
    desc: '爬取能力入口，背后加载 ReachFlow Skill+MCP',
    enabled: false,
  },
  {
    id: '4',
    modelId: 'packgate/asr-align',
    name: 'ASR + 字幕对齐',
    desc: '语音识别与字幕对齐组合模型',
    enabled: false,
  },
  {
    id: '5',
    modelId: 'packgate/remotion',
    name: 'Remotion 渲染',
    desc: '程序化视频打包入口',
    enabled: false,
  },
]

export function CompositeView() {
  const { toast } = useToast()
  const [items, setItems] = useState(INITIAL)

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">组合模型</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            这些 model id 会出现在 Claude Code / Codex / WorkBuddy 的模型下拉中——抢的就是这个入口。
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Demo：新建组合模型')}
          className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-blue-700"
        >
          新建
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              i < items.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-900">{item.name}</span>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">
                  {item.modelId}
                </code>
              </div>
              <p className="mt-0.5 text-[12px] text-slate-500">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toast(`Demo：编辑 ${item.modelId}`)}
              className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
            >
              编辑
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
                toast(
                  item.enabled
                    ? `已停用 ${item.modelId}`
                    : `已启用 ${item.modelId}（可供 Agent 选择）`,
                )
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
    </div>
  )
}
