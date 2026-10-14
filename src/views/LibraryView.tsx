import { useState } from 'react'
import { BookMarked, Download, Plus } from 'lucide-react'
import { useToast } from '../lib/toast'

const ITEMS = [
  { id: '1', name: '视频剪辑 SOP', kind: '说明', agents: ['Claude Code', 'WorkBuddy'] },
  { id: '2', name: 'ReachFlow 选择器库', kind: '片段', agents: ['Claude Code'] },
  { id: '3', name: '字幕规范 zh-CN', kind: '规范', agents: ['全部'] },
  { id: '4', name: 'Remotion 模板 · 口播', kind: '模板', agents: ['Codex'] },
]

export function LibraryView() {
  const { toast } = useToast()
  const [items] = useState(ITEMS)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-[#ebebef] px-4 py-2.5">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1a1c]">资料库</div>
          <div className="text-[11px] text-[#6b6b76]">对标 Magpie Library · 可挂到指定 Agents</div>
        </div>
        <button
          type="button"
          onClick={() => toast('新建资料条目（Demo）')}
          className="ml-auto flex items-center gap-1 rounded-md bg-[#2f6fed] px-2.5 py-1 text-[11.5px] font-medium text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          新建
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {items.map((it) => (
          <div key={it.id} className="card-lift flex items-center gap-3 rounded-xl bg-white px-3 py-2.5">
            <BookMarked className="h-4 w-4 text-[#2f6fed]" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-[#1a1a1c]">{it.name}</div>
              <div className="text-[11px] text-[#6b6b76]">
                {it.kind} · {it.agents.join('、')}
              </div>
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5]"
              onClick={() => toast(`导出 ${it.name}`)}
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
