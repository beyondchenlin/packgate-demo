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

export function CompositeView() {
  const { toast } = useToast()
  const [items, setItems] = useState(INITIAL)

  return (
    <div className="view-fade h-full overflow-auto bg-[#fafafa] p-4">
      <div className="mb-3.5 flex items-end justify-between">
        <div>
          <h2 className="text-[14px] font-semibold tracking-tight text-[#1a1a1c]">组合模型</h2>
          <p className="mt-0.5 text-[11.5px] text-[#8a8a96]">
            这些 model id 会出现在 Agent 的模型下拉中。
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Demo：新建组合模型')}
          className="rounded-[6px] bg-[#1a1a1c] px-2.5 py-[5px] text-[11.5px] font-medium text-white hover:bg-[#333]"
        >
          新建
        </button>
      </div>

      <div className="overflow-hidden rounded-[12px] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)]">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-3.5 py-3 ${
              i < items.length - 1 ? 'border-b border-[#f0f0f3]' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12.5px] font-semibold tracking-tight text-[#1a1a1c]">
                  {item.name}
                </span>
                <code className="rounded-[4px] bg-[#f4f4f6] px-1.5 py-[1px] font-mono text-[10.5px] text-[#5c5c66]">
                  {item.modelId}
                </code>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#8a8a96]">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toast(`Demo：编辑 ${item.modelId}`)}
              className="rounded-[6px] bg-[#f4f4f6] px-2 py-[4px] text-[11px] text-[#5c5c66] hover:bg-[#ececef]"
            >
              编辑
            </button>
            <Toggle
              on={item.enabled}
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
            />
          </div>
        ))}
      </div>
    </div>
  )
}
