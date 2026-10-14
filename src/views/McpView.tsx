import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useToast } from '../lib/toast'

const SEED = [
  { id: '1', name: 'filesystem', sync: { 'Claude Code': true, Codex: true, WorkBuddy: false }, transport: 'stdio' },
  { id: '2', name: 'browser', sync: { 'Claude Code': true, Codex: false, WorkBuddy: true }, transport: 'stdio' },
  { id: '3', name: 'packgate-local', sync: { 'Claude Code': true, Codex: true, WorkBuddy: true }, transport: 'http' },
  { id: '4', name: 'github', sync: { 'Claude Code': false, Codex: true, WorkBuddy: false }, transport: 'stdio' },
]

const APPS = ['Claude Code', 'Codex', 'WorkBuddy'] as const

export function McpView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(SEED)
  const [q, setQ] = useState('')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#ebebef] px-4 py-2.5">
        <div>
          <div className="text-[13px] font-semibold">MCP</div>
          <div className="text-[11px] text-[#6b6b76]">对标 CC Switch · 一处添加，按工具勾选同步</div>
        </div>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9c9ca8]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索" className="w-28 rounded-md border border-[#e2e2e8] py-1 pl-7 pr-2 text-[12px]" />
        </div>
        <button type="button" onClick={() => toast('导入已有 MCP')} className="rounded-md border border-[#e2e2e8] px-2 py-1 text-[11.5px]">导入</button>
        <button type="button" onClick={() => toast('添加 MCP 服务器')} className="flex items-center gap-1 rounded-md bg-[#2f6fed] px-2.5 py-1 text-[11.5px] text-white"><Plus className="h-3.5 w-3.5" />添加</button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {rows.filter((r) => !q || r.name.includes(q)).map((r) => (
          <div key={r.id} className="mb-2 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="text-[13px] font-semibold">{r.name}</div>
              <span className="rounded bg-[#f3f3f5] px-1 text-[10px] text-[#6b6b76]">{r.transport}</span>
              <button type="button" className="ml-auto text-[11px] text-[#2f6fed]" onClick={() => toast(`编辑 ${r.name}`)}>编辑</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {APPS.map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => {
                    setRows((xs) =>
                      xs.map((x) =>
                        x.id === r.id
                          ? { ...x, sync: { ...x.sync, [app]: !x.sync[app] } }
                          : x,
                      ),
                    )
                    toast(`${r.name} → ${app} ${r.sync[app] ? '关闭' : '开启'}`)
                  }}
                  className={`rounded-full px-2 py-[2px] text-[11px] ${
                    r.sync[app] ? 'bg-[#e8f8ee] text-[#0f7a3f]' : 'bg-[#f3f3f5] text-[#6b6b76]'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => toast('一键全部启用 Claude Code')} className="text-[11px] text-[#2f6fed]">按工具一键全部启用 / 停用…</button>
      </div>
    </div>
  )
}
