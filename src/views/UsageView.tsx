import { useToast } from '../lib/toast'

const BARS = [
  { label: 'claude-opus', value: 72, color: 'bg-orange-500' },
  { label: 'deepseek', value: 45, color: 'bg-blue-500' },
  { label: '本地 TTS', value: 88, color: 'bg-emerald-500' },
  { label: 'ASR', value: 36, color: 'bg-teal-500' },
  { label: 'ReachFlow', value: 21, color: 'bg-indigo-500' },
  { label: 'FFmpeg', value: 14, color: 'bg-amber-500' },
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
    <div className="h-full overflow-auto p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">用量</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            示意数据。正式版按 Agent / 目标 / Pack 维度统计。
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Demo：导出用量 CSV')}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] text-slate-600 hover:bg-slate-50"
        >
          导出
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => toast(`${s.label}：${s.value}`)}
            className="rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-blue-200"
          >
            <div className="text-[11px] text-slate-400">{s.label}</div>
            <div className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
              {s.value}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-[13px] font-medium text-slate-800">目标调用分布</div>
        <div className="space-y-2.5">
          {BARS.map((b) => (
            <button
              key={b.label}
              type="button"
              className="flex w-full items-center gap-3 text-left"
              onClick={() => toast(`${b.label} · 相对用量 ${b.value}%`)}
            >
              <span className="w-24 shrink-0 truncate text-[12px] text-slate-600">
                {b.label}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${b.color}`}
                  style={{ width: `${b.value}%` }}
                />
              </div>
              <span className="w-8 text-right text-[11px] tabular-nums text-slate-400">
                {b.value}%
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
