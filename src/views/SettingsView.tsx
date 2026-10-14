import type { ReactNode } from 'react'
import { useState } from 'react'
import { useToast } from '../lib/toast'

export function SettingsView({
  theme,
  onThemeChange,
  lang,
  onLangChange,
}: {
  theme: 'dark' | 'light'
  onThemeChange: (t: 'dark' | 'light') => void
  lang: 'zh' | 'en'
  onLangChange: (l: 'zh' | 'en') => void
}) {
  const { toast } = useToast()
  const [port, setPort] = useState('3425')
  const [preferAgentLlm, setPreferAgentLlm] = useState(true)

  return (
    <div className="h-full overflow-auto p-4">
      <h2 className="text-[15px] font-semibold text-slate-900">设置</h2>
      <p className="mt-0.5 mb-4 text-[12px] text-slate-500">
        Demo 配置仅存于浏览器内存，刷新后重置。
      </p>

      <div className="space-y-3">
        <Row label="语言" hint="界面语言">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {(
              [
                { id: 'zh' as const, label: '简体中文' },
                { id: 'en' as const, label: 'English' },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  onLangChange(o.id)
                  toast(o.id === 'zh' ? '已切换为简体中文' : 'Switched to English (partial)')
                }}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${
                  lang === o.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>

        <Row label="主题" hint="窗口内容区偏浅，外壳跟随桌面">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {(
              [
                { id: 'dark' as const, label: '深色外壳' },
                { id: 'light' as const, label: '浅色外壳' },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  onThemeChange(o.id)
                  toast(o.id === 'dark' ? '深色桌面外壳' : '浅色桌面外壳')
                }}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${
                  theme === o.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>

        <Row label="网关端口" hint="默认 3425（对标 Magpie）">
          <div className="flex items-center gap-2">
            <input
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-24 rounded-md border border-slate-200 px-2 py-1 font-mono text-[12px] text-slate-800 outline-none focus:border-blue-400"
            />
            <button
              type="button"
              onClick={() => toast(`Demo：网关端口设为 ${port}`)}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-[12px] text-slate-600 hover:bg-slate-50"
            >
              应用
            </button>
          </div>
        </Row>

        <Row
          label="无云模型时优先 Agent 自带 LLM"
          hint="后台未配置云 LLM 时，对话/推理走 WorkBuddy、Claude Code、Codex 等自带额度"
        >
          <button
            type="button"
            role="switch"
            aria-checked={preferAgentLlm}
            onClick={() => {
              setPreferAgentLlm((v) => !v)
              toast(
                preferAgentLlm
                  ? '已关闭：将要求配置云模型'
                  : '已开启：无云模型时优先 Agent 自带 LLM',
              )
            }}
            className={`relative h-5 w-9 shrink-0 rounded-full transition ${
              preferAgentLlm ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                preferAgentLlm ? 'translate-x-4' : ''
              }`}
            />
          </button>
        </Row>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-[13px] font-semibold text-slate-900">关于 PackGate</div>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
            本地统一网关 Demo：抢 Agent「选模型」入口，背后是可热加载的重型 Skill+MCP Pack（TTS /
            ASR / 剪辑 / Remotion / ReachFlow…）。主程序拟 MIT；ComfyUI 等 GPL 仅作 sidecar。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toast('License: MIT')}
              className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] text-white"
            >
              MIT License
            </button>
            <button
              type="button"
              onClick={() => toast('版本 0.1.0-demo')}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600"
            >
              v0.1.0-demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-slate-900">{label}</div>
        <div className="text-[11px] text-slate-400">{hint}</div>
      </div>
      {children}
    </div>
  )
}
