import { useState } from 'react'
import { ExternalLink, Search, Trash2 } from 'lucide-react'
import { useToast } from '../lib/toast'

const ROWS = [
  { id: '1', agent: 'Claude Code', title: '视频剪辑管线调试', cost: '$0.42', tokens: '18.2k', when: '今天 12:08' },
  { id: '2', agent: 'Codex', title: 'ReachFlow 选择器修复', cost: '$0.11', tokens: '6.4k', when: '今天 10:41' },
  { id: '3', agent: 'WorkBuddy', title: '配音草稿 · TTS', cost: '$0.00', tokens: '本地', when: '昨天 22:15' },
  { id: '4', agent: 'Gemini CLI', title: '字幕对齐批处理', cost: '$0.07', tokens: '3.1k', when: '昨天 18:02' },
  { id: '5', agent: 'Claude Code', title: 'Pack 热加载协议', cost: '$1.28', tokens: '52k', when: '周一' },
]

export function SessionsView() {
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [rows, setRows] = useState(ROWS)
  const shown = rows.filter(
    (r) =>
      !q ||
      r.title.includes(q) ||
      r.agent.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#ebebef] px-4 py-2.5">
        <div className="text-[13px] font-semibold text-[#1a1a1c]">会话</div>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9c9ca8]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索标题 / Agent"
            className="w-[180px] rounded-md border border-[#e2e2e8] bg-white py-1 pl-7 pr-2 text-[12px] outline-none"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {shown.map((r) => (
          <div
            key={r.id}
            className="mb-2 flex items-center gap-3 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-[#1a1a1c]">{r.title}</div>
              <div className="mt-0.5 text-[11px] text-[#6b6b76]">
                {r.agent} · {r.when} · {r.tokens} · {r.cost}
              </div>
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 text-[#5c5c66] hover:bg-[#f3f3f5]"
              title="在终端重新打开"
              onClick={() => toast(`打开会话：${r.title}`)}
            >
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-[#b91c1c]/80 hover:bg-[#fef2f2]"
              onClick={() => {
                setRows((xs) => xs.filter((x) => x.id !== r.id))
                toast('已删除会话记录（Demo）')
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
