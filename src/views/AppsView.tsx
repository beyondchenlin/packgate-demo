import { useState } from 'react'
import { AppWindow, Download, Eye, EyeOff } from 'lucide-react'
import { useToast } from '../lib/toast'

const APPS = [
  { id: 'claude-code', name: 'Claude Code', ver: '2.1.4', path: '~/.local/bin/claude', visible: true, update: false },
  { id: 'codex', name: 'Codex', ver: '0.48.0', path: '/usr/local/bin/codex', visible: true, update: true },
  { id: 'workbuddy', name: 'WorkBuddy', ver: '1.0.2', path: '/Applications/WorkBuddy.app', visible: true, update: false },
  { id: 'gemini', name: 'Gemini CLI', ver: '0.9.1', path: '~/.npm-global/bin/gemini', visible: true, update: false },
  { id: 'opencode', name: 'OpenCode', ver: '—', path: '未安装', visible: false, update: false },
]

export function AppsView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(APPS)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-[#ebebef] px-4 py-2.5">
        <div>
          <div className="text-[13px] font-semibold">应用</div>
          <div className="text-[11px] text-[#6b6b76]">对标 CC Switch · 安装/升级/侧栏显示</div>
        </div>
        <button type="button" onClick={() => toast('全部升级（Demo）')} className="ml-auto rounded-md bg-[#2f6fed] px-2.5 py-1 text-[11.5px] text-white">全部升级</button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {rows.map((a) => (
          <div key={a.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5">
            <AppWindow className="h-4 w-4 text-[#475569]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[13px] font-medium">
                {a.name}
                {a.update && <span className="rounded bg-[#fef3c7] px-1 text-[9.5px] text-[#92400e]">有更新</span>}
              </div>
              <div className="truncate text-[11px] text-[#6b6b76]">{a.ver} · {a.path}</div>
            </div>
            <button
              type="button"
              title={a.visible ? '从侧栏隐藏' : '显示在侧栏'}
              onClick={() => {
                setRows((xs) => xs.map((x) => x.id === a.id ? { ...x, visible: !x.visible } : x))
                toast(a.visible ? `已隐藏 ${a.name}` : `已显示 ${a.name}`)
              }}
              className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5]"
            >
              {a.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => toast(a.path === '未安装' ? `安装 ${a.name}` : `升级 ${a.name}`)}
              className="flex items-center gap-1 rounded-md border border-[#e2e2e8] px-2 py-1 text-[11px]"
            >
              <Download className="h-3.5 w-3.5" />
              {a.path === '未安装' ? '安装' : a.update ? '升级' : '重装'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
