import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { AGENTS } from '../lib/types'
import { useToast } from '../lib/toast'

const SEED = [
  { id: '1', name: '系统 · 视频剪辑助手', app: 'claude-code', enabled: true, preview: '你是本地 Pack 编排助手…' },
  { id: '2', name: 'Code review 严苛模式', app: 'codex', enabled: false, preview: '只指出缺陷，不写废话…' },
  { id: '3', name: '字幕校对', app: 'claude-code', enabled: true, preview: '对齐时间轴并修正口误…' },
]

export function PromptsView() {
  const { toast } = useToast()
  const [rows, setRows] = useState(SEED)
  const [edit, setEdit] = useState<string | null>(null)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-[#ebebef] px-4 py-2.5">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1a1c]">提示词</div>
          <div className="text-[11px] text-[#6b6b76]">对标 CC Switch · 按工具分别维护 Markdown</div>
        </div>
        <button
          type="button"
          onClick={() => toast('新建提示词（Demo）')}
          className="ml-auto flex items-center gap-1 rounded-md bg-[#2f6fed] px-2.5 py-1 text-[11.5px] font-medium text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          新建
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {rows.map((r) => (
          <div key={r.id} className="mb-2 rounded-xl border border-[#ebebef] bg-white px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-[#1a1a1c]">{r.name}</div>
                <div className="text-[11px] text-[#6b6b76]">
                  {AGENTS.find((a) => a.id === r.app)?.label ?? r.app} · {r.preview}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRows((xs) =>
                    xs.map((x) =>
                      x.id === r.id ? { ...x, enabled: !x.enabled } : x,
                    ),
                  )
                  toast(r.enabled ? `已停用 ${r.name}` : `已启用并写入 ${r.name}`)
                }}
                className={`rounded-full px-2 py-[2px] text-[11px] font-medium ${
                  r.enabled ? 'bg-[#e8f8ee] text-[#0f7a3f]' : 'bg-[#f3f3f5] text-[#6b6b76]'
                }`}
              >
                {r.enabled ? '已启用' : '未启用'}
              </button>
              <button
                type="button"
                className="text-[11px] text-[#2f6fed]"
                onClick={() => setEdit(r.id)}
              >
                编辑
              </button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/25 p-8" onClick={() => setEdit(null)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-[14px] font-semibold">编辑提示词</div>
            <textarea
              className="h-40 w-full rounded-lg border border-[#e2e2e8] p-2 text-[12px]"
              defaultValue={rows.find((x) => x.id === edit)?.preview}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" className="text-[12px] text-[#6b6b76]" onClick={() => setEdit(null)}>取消</button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-md bg-[#2f6fed] px-3 py-1.5 text-[12px] text-white"
                onClick={() => { setEdit(null); toast('已保存提示词') }}
              >
                <Check className="h-3.5 w-3.5" /> 保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
