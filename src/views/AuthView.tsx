import { useState } from 'react'
import { KeyRound, LogIn, RefreshCw } from 'lucide-react'
import { useToast } from '../lib/toast'

const ACCOUNTS = [
  { id: '1', provider: 'GitHub Copilot', account: 'beyond***@gmail.com', status: '正常', need: false },
  { id: '2', provider: 'ChatGPT', account: 'plus***@outlook.com', status: '需重新登录', need: true },
  { id: '3', provider: 'xAI · Grok', account: '未登录', status: '—', need: false },
]

export function AuthView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(ACCOUNTS)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#ebebef] px-4 py-2.5">
        <div className="text-[13px] font-semibold">授权中心</div>
        <div className="text-[11px] text-[#6b6b76]">对标 CC Switch · 订阅当供应商（路由模式下使用）</div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {rows.map((a) => (
          <div key={a.id} className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 ${a.need ? 'border-[#fde68a]' : 'border-[#ebebef]'}`}>
            <KeyRound className={`h-4 w-4 ${a.need ? 'text-[#b45309]' : 'text-[#2f6fed]'}`} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">{a.provider}</div>
              <div className="text-[11px] text-[#6b6b76]">{a.account} · {a.status}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setRows((xs) => xs.map((x) => x.id === a.id ? { ...x, status: '正常', need: false, account: x.account.includes('未') ? 'user***@x.ai' : x.account } : x))
                toast(`登录 ${a.provider}（Demo OAuth）`)
              }}
              className="flex items-center gap-1 rounded-md border border-[#e2e2e8] px-2 py-1 text-[11.5px]"
            >
              <LogIn className="h-3.5 w-3.5" /> {a.account.includes('未') || a.need ? '登录' : '换号'}
            </button>
            <button type="button" className="rounded-md p-1.5 text-[#6b6b76] hover:bg-[#f3f3f5]" onClick={() => toast('刷新额度')}>
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <p className="px-1 text-[11px] leading-relaxed text-[#8a8a96]">
          在官方客户端以外使用订阅可能违反厂商条款，请自行评估风险。
        </p>
      </div>
    </div>
  )
}
