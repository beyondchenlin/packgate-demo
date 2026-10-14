import { useState } from 'react'
import { Download, RefreshCw, Search, Sparkles } from 'lucide-react'
import { useToast } from '../lib/toast'

const INSTALLED = [
  { id: '1', name: 'code-review', src: 'skills.sh', apps: ['Claude Code', 'Codex'], ver: '1.2.0' },
  { id: '2', name: 'git-commit', src: 'GitHub', apps: ['Claude Code'], ver: '0.9.1' },
]

const DISCOVER = [
  { id: 'd1', name: 'pdf-extract', stars: 420, desc: '抽取 PDF 文本与表格' },
  { id: 'd2', name: 'web-research', stars: 880, desc: '多源检索并汇总' },
  { id: 'd3', name: 'test-writer', stars: 310, desc: '按 diff 生成测试' },
]

export function SkillsView() {
  const { toast } = useToast()
  const [tab, setTab] = useState<'installed' | 'discover'>('installed')
  const [q, setQ] = useState('')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#ebebef] px-4 py-2.5">
        <div className="seg-track flex">
          <button type="button" onClick={() => setTab('installed')} className={`seg-item rounded-[6px] px-2.5 py-[4px] text-[11.5px] ${tab==='installed'?'bg-white font-medium shadow-sm':'text-[#6b6b76]'}`}>已安装</button>
          <button type="button" onClick={() => setTab('discover')} className={`seg-item rounded-[6px] px-2.5 py-[4px] text-[11.5px] ${tab==='discover'?'bg-white font-medium shadow-sm':'text-[#6b6b76]'}`}>发现技能</button>
        </div>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9c9ca8]" />
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="skills.sh / GitHub" className="w-40 rounded-md border border-[#e2e2e8] py-1 pl-7 pr-2 text-[12px]" />
        </div>
        <button type="button" onClick={() => toast('检查更新…')} className="rounded-md border border-[#e2e2e8] p-1.5"><RefreshCw className="h-3.5 w-3.5" /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === 'installed' && INSTALLED.filter(s=>!q||s.name.includes(q)).map((s) => (
          <div key={s.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5">
            <Sparkles className="h-4 w-4 text-[#7c5cbf]" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">{s.name} <span className="text-[10px] text-[#9c9ca8]">v{s.ver}</span></div>
              <div className="text-[11px] text-[#6b6b76]">{s.src} · {s.apps.join('、')}</div>
            </div>
            <button type="button" className="text-[11px] text-[#2f6fed]" onClick={() => toast(`同步设置 · ${s.name}`)}>同步</button>
          </div>
        ))}
        {tab === 'discover' && DISCOVER.filter(s=>!q||s.name.includes(q)).map((s) => (
          <div key={s.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">{s.name}</div>
              <div className="text-[11px] text-[#6b6b76]">{s.desc} · ★ {s.stars}</div>
            </div>
            <button type="button" onClick={() => toast(`已安装 ${s.name}`)} className="flex items-center gap-1 rounded-md bg-[#2f6fed] px-2 py-1 text-[11px] text-white">
              <Download className="h-3 w-3" /> 安装
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
