import { useToast } from '../lib/toast'

const BARS = [
  { label: 'claude-opus', value: 72, color: '#c47a2a' },
  { label: 'deepseek', value: 45, color: '#4f6bed' },
  { label: '本地 TTS', value: 88, color: '#2d8a5e' },
  { label: 'ASR', value: 36, color: '#3a8a84' },
  { label: 'ReachFlow', value: 21, color: '#5b5bd6' },
  { label: 'FFmpeg', value: 14, color: '#b07a2a' },
]

const STATS = [
  { label: '今日请求', value: '1,284' },
  { label: '本地 Pack 占比', value: '41%' },
  { label: 'Agent 自带 LLM', value: '312' },
  { label: '云模型调用', value: '756' },
]

export function UsageView() {
  const { toast } = useToast()

  return (
    <div className="view-fade h-full overflow-auto bg-[#fafafa] p-4">
      <div className="mb-3.5 flex items-end justify-between">
        <div>
          <h2 className="text-[14px] font-semibold tracking-tight text-[#1a1a1c]">用量</h2>
          <p className="mt-0.5 text-[11.5px] text-[#8a8a96]">示意数据。正式版按 Agent / 目标 / Pack 统计。</p>
        </div>
        <button
          type="button"
          onClick={() => toast('Demo：导出用量 CSV')}
          className="rounded-[6px] bg-white px-2.5 py-[5px] text-[11.5px] text-[#5c5c66] shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)] hover:bg-[#f7f7f8]"
        >
          导出
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STATS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => toast(`${s.label}：${s.value}`)}
            className="card-lift rounded-[12px] bg-white p-3 text-left"
          >
            <div className="text-[10.5px] text-[#9c9ca8]">{s.label}</div>
            <div className="mt-1 text-[18px] font-semibold tabular-nums tracking-tight text-[#1a1a1c]">
              {s.value}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-[12px] bg-white p-4 shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)]">
        <div className="mb-3 text-[12.5px] font-medium tracking-tight text-[#1a1a1c]">目标调用分布</div>
        <div className="space-y-2">
          {BARS.map((b) => (
            <button
              key={b.label}
              type="button"
              className="flex w-full items-center gap-3 text-left"
              onClick={() => toast(`${b.label} · 相对用量 ${b.value}%`)}
            >
              <span className="w-24 shrink-0 truncate text-[11.5px] text-[#5c5c66]">{b.label}</span>
              <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#f0f0f3]">
                <div className="h-full rounded-full" style={{ width: `${b.value}%`, background: b.color }} />
              </div>
              <span className="w-8 text-right text-[10.5px] tabular-nums text-[#9c9ca8]">{b.value}%</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
