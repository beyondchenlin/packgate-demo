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
    <div className="view-fade h-full overflow-auto bg-[#fafafa] p-4">
      <h2 className="text-[14px] font-semibold tracking-tight text-[#1a1a1c]">设置</h2>
      <p className="mt-0.5 mb-3.5 text-[11.5px] text-[#8a8a96]">
        Demo 配置仅存于浏览器内存，刷新后重置。
      </p>

      <div className="space-y-2.5">
        <Row label="语言" hint="界面语言">
          <div className="seg-track flex gap-0">
            {(
              [
                { id: 'zh' as const, label: '简体中文' },
                { id: 'en' as const, label: 'English' },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                data-active={lang === o.id}
                onClick={() => {
                  onLangChange(o.id)
                  toast(o.id === 'zh' ? '已切换为简体中文' : 'Switched to English (partial)')
                }}
                className={`seg-item rounded-[6px] px-2.5 py-[5px] text-[11.5px] ${
                  lang === o.id ? 'font-medium text-[#1a1a1c]' : 'text-[#6b6b76]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>

        <Row label="主题" hint="桌面外壳">
          <div className="seg-track flex gap-0">
            {(
              [
                { id: 'dark' as const, label: '深色外壳' },
                { id: 'light' as const, label: '浅色外壳' },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                data-active={theme === o.id}
                onClick={() => {
                  onThemeChange(o.id)
                  toast(o.id === 'dark' ? '深色桌面外壳' : '浅色桌面外壳')
                }}
                className={`seg-item rounded-[6px] px-2.5 py-[5px] text-[11.5px] ${
                  theme === o.id ? 'font-medium text-[#1a1a1c]' : 'text-[#6b6b76]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>

        <Row label="网关端口" hint="默认 3425">
          <div className="flex items-center gap-2">
            <input
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-20 rounded-[6px] border border-[#e2e2e8] bg-white px-2 py-[4px] font-mono text-[12px] text-[#1a1a1c] outline-none focus:border-[#2f6fed]"
            />
            <button
              type="button"
              onClick={() => toast(`Demo：网关端口设为 ${port}`)}
              className="rounded-[6px] bg-[#f4f4f6] px-2.5 py-[4px] text-[11.5px] text-[#5c5c66] hover:bg-[#ececef]"
            >
              应用
            </button>
          </div>
        </Row>

        <Row
          label="无云模型时优先 Agent 自带 LLM"
          hint="后台未配置云 LLM 时，走入口 Agent 自带额度"
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
            className={`toggle-track relative h-[18px] w-[32px] shrink-0 rounded-full ${
              preferAgentLlm ? 'bg-[#1a1a1c]' : 'bg-[#d8d8de]'
            }`}
          >
            <span
              className={`toggle-thumb absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm ${
                preferAgentLlm ? 'translate-x-[14px]' : ''
              }`}
            />
          </button>
        </Row>

        <div className="rounded-[12px] bg-white p-4 shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)]">
          <div className="text-[12.5px] font-semibold tracking-tight text-[#1a1a1c]">
            关于 PackGate
          </div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-[#8a8a96]">
            本地统一网关 Demo：在 CC Switch + Magpie 交互语法上抢 Agent「选模型」入口，背后是可热加载的重型
            Skill+MCP Pack。主程序拟 MIT。
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => toast('License: MIT')}
              className="rounded-[6px] bg-[#1a1a1c] px-2.5 py-[4px] text-[11px] text-white"
            >
              MIT License
            </button>
            <button
              type="button"
              onClick={() => toast('版本 0.1.1-demo')}
              className="rounded-[6px] bg-[#f4f4f6] px-2.5 py-[4px] text-[11px] text-[#5c5c66]"
            >
              v0.1.1-demo
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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-white px-3.5 py-3 shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)]">
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium tracking-tight text-[#1a1a1c]">{label}</div>
        <div className="text-[10.5px] text-[#9c9ca8]">{hint}</div>
      </div>
      {children}
    </div>
  )
}
