import { useState } from 'react'
import { Download, EyeOff } from 'lucide-react'
import { useToast } from '../lib/toast'

const QUOTAS = [
  { name: 'Claude Max', window: '5 小时', used: 68, pace: '+6%' },
  { name: 'ChatGPT Plus', window: '周', used: 41, pace: '−3%' },
  { name: 'DeepSeek 余额', window: '账户', used: 22, pace: '—' },
  { name: 'Kimi Coding', window: '5 小时', used: 91, pace: '+18%' },
]

const LOGS = [
  { t: '13:41:02', agent: 'Claude Code', model: 'glm-4.6', tok: '2.1k', cost: '$0.02', cache: '41%' },
  { t: '13:40:18', agent: 'Codex', model: 'deepseek-v3', tok: '4.8k', cost: '$0.01', cache: '12%' },
  { t: '13:38:55', agent: 'WorkBuddy', model: 'local/tts', tok: '—', cost: '$0.00', cache: '—' },
  { t: '13:36:11', agent: 'Claude Code', model: 'deepseek-v3', tok: '1.2k', cost: '$0.00', cache: '0%' },
]

export function UsageView() {
  const { toast } = useToast()
  const [tab, setTab] = useState<'allowance' | 'stats' | 'heatmap'>('allowance')
  const [mask, setMask] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#ebebef] px-4 py-2.5">
        <div className="seg-track flex">
          {(
            [
              ['allowance', '额度'],
              ['stats', '请求'],
              ['heatmap', '热力图'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`seg-item rounded-[6px] px-2.5 py-[4px] text-[11.5px] ${
                tab === id
                  ? 'bg-white font-medium shadow-sm text-[#1a1a1c]'
                  : 'text-[#6b6b76]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setMask((v) => !v)
            toast(mask ? '已显示账号' : '已隐藏账号')
          }}
          className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#6b6b76] hover:bg-[#f3f3f5]"
        >
          <EyeOff className="h-3 w-3" />
          {mask ? '已隐藏' : '隐藏账号'}
        </button>
        <button
          type="button"
          onClick={() => toast('已导出 CSV 到下载目录（Demo）')}
          className="flex items-center gap-1 rounded-md border border-[#e2e2e8] px-2 py-1 text-[11px]"
        >
          <Download className="h-3 w-3" /> CSV
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === 'allowance' && (
          <div className="grid grid-cols-2 gap-2">
            {QUOTAS.map((q) => (
              <div
                key={q.name}
                className="rounded-xl border border-[#ebebef] bg-white p-3"
              >
                <div className="flex items-center justify-between text-[12px] font-medium">
                  <span>{mask ? '••••' : q.name}</span>
                  <span className="text-[11px] text-[#6b6b76]">{q.window}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f3f3f5]">
                  <div
                    className={`h-full rounded-full ${
                      q.used >= 90
                        ? 'bg-[#dc2626]'
                        : q.used >= 70
                          ? 'bg-[#f59e0b]'
                          : 'bg-[#2f6fed]'
                    }`}
                    style={{ width: `${q.used}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-[#6b6b76]">
                  <span>已用 {q.used}%</span>
                  <span>Pace {q.pace}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'stats' && (
          <div className="overflow-hidden rounded-xl border border-[#ebebef] bg-white">
            <div className="grid grid-cols-[70px_1fr_1fr_60px_50px_50px] gap-1 border-b border-[#ebebef] bg-[#fafafa] px-3 py-1.5 text-[10px] text-[#9c9ca8]">
              <span>时间</span>
              <span>Agent</span>
              <span>模型</span>
              <span>Token</span>
              <span>花费</span>
              <span>缓存</span>
            </div>
            {LOGS.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toast(`请求详情 · ${r.model}`)}
                className="grid w-full grid-cols-[70px_1fr_1fr_60px_50px_50px] gap-1 border-b border-[#f5f5f7] px-3 py-2 text-left text-[11px] hover:bg-[#fafafa]"
              >
                <span className="font-mono text-[#6b6b76]">{r.t}</span>
                <span>{r.agent}</span>
                <span className="truncate">{r.model}</span>
                <span>{r.tok}</span>
                <span>{r.cost}</span>
                <span>{r.cache}</span>
              </button>
            ))}
          </div>
        )}

        {tab === 'heatmap' && (
          <div className="rounded-xl border border-[#ebebef] bg-white p-3">
            <div className="mb-2 text-[12px] font-medium">近 53 周用量热力图</div>
            <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-[2px]">
              {Array.from({ length: 53 * 7 }).map((_, i) => {
                const v = (Math.sin(i * 0.37) + 1) / 2
                const op = v < 0.2 ? 0.08 : v < 0.45 ? 0.25 : v < 0.7 ? 0.5 : 0.85
                return (
                  <button
                    key={i}
                    type="button"
                    title={`日 ${i}`}
                    onClick={() => toast(`热力格 #${i}`)}
                    className="aspect-square rounded-[2px] bg-[#2f6fed]"
                    style={{ opacity: op }}
                  />
                )
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[#9c9ca8]">
              <span>少</span>
              <span>多</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
