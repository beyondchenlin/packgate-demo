import { useState } from 'react'
import { Package, Plus } from 'lucide-react'
import { useToast } from '../lib/toast'

const PLUGINS = [
  { id: '1', name: 'opencode-gemini-auth', kind: '登录', status: '已启用', desc: 'npm · OpenCode Gemini 登录' },
  { id: '2', name: 'gateway-redact', kind: '中间件', status: '已启用', desc: 'onRequest 脱敏日志' },
  { id: '3', name: 'usage-webhook', kind: '中间件', status: '未启用', desc: 'onResponse 推送用量' },
]

export function PluginsView() {
  const { toast } = useToast()
  const [tab, setTab] = useState<'installed' | 'discover'>('installed')
  const [rows, setRows] = useState(PLUGINS)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#ebebef] px-4 py-2.5">
        <div>
          <div className="text-[13px] font-semibold">插件</div>
          <div className="text-[11px] text-[#6b6b76]">对标 Magpie · npm 登录插件 / 网关中间件</div>
        </div>
        <div className="seg-track ml-auto flex">
          <button type="button" onClick={() => setTab('installed')} className={`seg-item rounded-[6px] px-2.5 py-[4px] text-[11.5px] ${tab==='installed'?'bg-white font-medium shadow-sm':'text-[#6b6b76]'}`}>已安装</button>
          <button type="button" onClick={() => setTab('discover')} className={`seg-item rounded-[6px] px-2.5 py-[4px] text-[11.5px] ${tab==='discover'?'bg-white font-medium shadow-sm':'text-[#6b6b76]'}`}>发现</button>
        </div>
        <button type="button" onClick={() => toast('magpie plugin add …')} className="flex items-center gap-1 rounded-md bg-[#2f6fed] px-2.5 py-1 text-[11.5px] text-white"><Plus className="h-3.5 w-3.5" />添加</button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === 'installed' && rows.map((p) => (
          <div key={p.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5">
            <Package className="h-4 w-4 text-[#0d9488]" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">{p.name} <span className="text-[10px] text-[#9c9ca8]">{p.kind}</span></div>
              <div className="text-[11px] text-[#6b6b76]">{p.desc}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setRows((xs) => xs.map((x) => x.id === p.id ? { ...x, status: x.status === '已启用' ? '未启用' : '已启用' } : x))
                toast(`${p.name} 已切换`)
              }}
              className={`rounded-full px-2 py-[2px] text-[11px] ${p.status==='已启用'?'bg-[#e8f8ee] text-[#0f7a3f]':'bg-[#f3f3f5] text-[#6b6b76]'}`}
            >
              {p.status}
            </button>
          </div>
        ))}
        {tab === 'discover' && (
          <div className="space-y-2">
            {['网关中间件市场', 'OpenCode 登录插件', '社区 magpie-community/plugins'].map((n) => (
              <button key={n} type="button" onClick={() => toast(`打开 ${n}`)} className="flex w-full rounded-xl border border-[#ebebef] bg-white px-3 py-3 text-left text-[12.5px] hover:border-[#2f6fed]/30">
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
