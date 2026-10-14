import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { useToast } from '../lib/toast'

export function GatewayView({ on }: { on: boolean }) {
  const { toast } = useToast()
  const [port, setPort] = useState('3425')
  const [cors, setCors] = useState(true)
  const [callerKeys, setCallerKeys] = useState(true)
  const [logs, setLogs] = useState([
    'GET /v1/models 200',
    'POST /v1/chat/completions → deepseek-v3 200 412ms',
    'POST /v1/messages → local/tts 200 88ms',
  ])

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="text-[13px] font-semibold text-[#1a1a1c]">网关</div>
        <span className={`rounded-full px-2 py-[2px] text-[11px] font-medium ${on ? 'bg-[#e8f8ee] text-[#0f7a3f]' : 'bg-[#f3f3f5] text-[#6b6b76]'}`}>
          {on ? '运行中' : '已停止'}
        </span>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <label className="rounded-xl border border-[#ebebef] bg-white p-3">
          <div className="text-[11px] text-[#6b6b76]">监听端口</div>
          <input value={port} onChange={(e) => setPort(e.target.value)} className="mt-1 w-full text-[14px] font-semibold outline-none" />
        </label>
        <div className="rounded-xl border border-[#ebebef] bg-white p-3">
          <div className="text-[11px] text-[#6b6b76]">兼容协议</div>
          <div className="mt-1 text-[12px] text-[#1a1a1c]">OpenAI · Anthropic · Gemini</div>
        </div>
      </div>
      <div className="mb-3 space-y-2 rounded-xl border border-[#ebebef] bg-white p-3">
        <Toggle label="允许 CORS（浏览器调试）" on={cors} set={setCors} />
        <Toggle label="调用方 Key 隔离" on={callerKeys} set={setCallerKeys} />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <div className="text-[12px] font-medium text-[#1a1a1c]">环境变量示例</div>
        <button type="button" className="ml-auto flex items-center gap-1 text-[11px] text-[#2f6fed]" onClick={() => toast('已复制')}>
          <Copy className="h-3 w-3" /> 复制
        </button>
      </div>
      <pre className="mb-3 overflow-x-auto rounded-xl bg-[#1a1a1c] p-3 text-[11px] leading-relaxed text-[#e5e5ea]">
{`export OPENAI_BASE_URL=http://127.0.0.1:${port}/v1
export OPENAI_API_KEY=packgate
export ANTHROPIC_BASE_URL=http://127.0.0.1:${port}
export ANTHROPIC_API_KEY=packgate`}
      </pre>
      <div className="mb-2 flex items-center">
        <div className="text-[12px] font-medium">实时日志</div>
        <button
          type="button"
          className="ml-auto flex items-center gap-1 text-[11px] text-[#6b6b76]"
          onClick={() => {
            setLogs((l) => [`POST /v1/chat/completions → kimi-k2 200 ${80 + Math.floor(Math.random()*200)}ms`, ...l].slice(0, 8))
            toast('已刷新日志')
          }}
        >
          <RefreshCw className="h-3 w-3" /> 刷新
        </button>
      </div>
      <div className="space-y-1 rounded-xl border border-[#ebebef] bg-white p-2 font-mono text-[11px] text-[#3a3a42]">
        {logs.map((l, i) => (
          <div key={i} className="truncate px-1 py-0.5">{l}</div>
        ))}
      </div>
    </div>
  )
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => set(!on)} className="flex w-full items-center justify-between text-[12px] text-[#1a1a1c]">
      {label}
      <span className={`h-5 w-9 rounded-full p-0.5 transition ${on ? 'bg-[#2f6fed]' : 'bg-[#d4d4dc]'}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${on ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  )
}
