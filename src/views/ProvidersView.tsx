import { useState } from 'react'
import { useToast } from '../lib/toast'

type Provider = {
  id: string
  name: string
  endpoint: string
  enabled: boolean
  latency?: string
}

const INITIAL: Provider[] = [
  {
    id: '1',
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com',
    enabled: true,
    latency: '186 ms',
  },
  {
    id: '2',
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    enabled: true,
    latency: '142 ms',
  },
  {
    id: '3',
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com',
    enabled: true,
    latency: '98 ms',
  },
  {
    id: '4',
    name: '智谱 GLM',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    enabled: false,
  },
  {
    id: '5',
    name: 'Moonshot Kimi',
    endpoint: 'https://api.moonshot.cn/v1',
    enabled: false,
  },
  {
    id: '6',
    name: 'New API（可选聚合）',
    endpoint: 'http://127.0.0.1:3000/v1',
    enabled: false,
  },
]

export function ProvidersView() {
  const { toast } = useToast()
  const [items, setItems] = useState(INITIAL)

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">云 Provider</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            可选云模型上游。未配置时，对话优先走入口 Agent 自带 LLM / 额度。
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Demo：添加 Provider')}
          className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-blue-700"
        >
          添加
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[13px] font-semibold text-slate-900">{p.name}</div>
                <div className="mt-0.5 truncate font-mono text-[11px] text-slate-400">
                  {p.endpoint}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={p.enabled}
                onClick={() => {
                  setItems((prev) =>
                    prev.map((x) =>
                      x.id === p.id ? { ...x, enabled: !x.enabled } : x,
                    ),
                  )
                  toast(p.enabled ? `已停用 ${p.name}` : `已启用 ${p.name}`)
                }}
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                  p.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                    p.enabled ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
            {p.latency && (
              <div className="mt-2 text-[11px] text-emerald-600">延迟 {p.latency}</div>
            )}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => toast(`Demo：编辑 ${p.name}`)}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
              >
                编辑
              </button>
              <button
                type="button"
                onClick={() => toast(`测速 ${p.name}…（Demo：${p.latency ?? '超时模拟'}）`)}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
              >
                测速
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
