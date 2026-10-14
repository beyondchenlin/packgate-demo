import { useState } from 'react'
import { ToastProvider, useToast } from './lib/toast'
import type { AgentId, NavId } from './lib/types'
import { Sidebar } from './components/Sidebar'
import { TitleBar } from './components/TitleBar'
import { RoutingView } from './views/RoutingView'
import { PackMarketView } from './views/PackMarketView'
import { CompositeView } from './views/CompositeView'
import { McpSkillsView } from './views/McpSkillsView'
import { ProvidersView } from './views/ProvidersView'
import { UsageView } from './views/UsageView'
import { SettingsView } from './views/SettingsView'

function DesktopApp() {
  const { toast } = useToast()
  const [nav, setNav] = useState<NavId>('routing')
  const [gatewayOn, setGatewayOn] = useState(true)
  const [agent, setAgent] = useState<AgentId>('claude-code')
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [lang, setLang] = useState<'zh' | 'en'>('zh')

  return (
    <div
      className={`desktop-bg relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden p-5 sm:p-10 ${
        theme === 'dark' ? 'theme-dark' : ''
      }`}
    >
      <div
        className="window-shell relative flex w-[min(940px,88vw)] flex-col"
        style={{ height: 'min(660px, 80vh)' }}
      >
        <TitleBar
          gatewayOn={gatewayOn}
          onToggleGateway={() => {
            setGatewayOn((v) => {
              const next = !v
              toast(next ? '网关已开启 · localhost:3425' : '网关已关闭')
              return next
            })
          }}
          agent={agent}
          onAgentChange={setAgent}
        />

        <div className="flex min-h-0 flex-1">
          <Sidebar
            active={nav}
            onChange={(id) => {
              setNav(id)
              toast(
                {
                  routing: '路由',
                  composite: '组合模型',
                  packs: 'Pack 市场',
                  mcp: 'MCP / Skills',
                  providers: '云 Provider',
                  usage: '用量',
                  settings: '设置',
                }[id],
              )
            }}
          />
          <main className="min-w-0 flex-1 bg-[#fafafa]">
            {!gatewayOn && (nav === 'routing' || nav === 'providers') && (
              <div className="border-b border-[#f3e6c8] bg-[#fffbeb] px-4 py-1.5 text-[11px] text-[#92400e]">
                网关已关闭 — Demo 仍可浏览；正式版将拒绝代理请求。
              </div>
            )}
            {nav === 'routing' && <RoutingView agent={agent} />}
            {nav === 'composite' && <CompositeView />}
            {nav === 'packs' && <PackMarketView />}
            {nav === 'mcp' && <McpSkillsView />}
            {nav === 'providers' && (
              <ProvidersView
                agent={agent}
                onAgentChange={setAgent}
                gatewayOn={gatewayOn}
              />
            )}
            {nav === 'usage' && <UsageView />}
            {nav === 'settings' && (
              <SettingsView
                theme={theme}
                onThemeChange={setTheme}
                lang={lang}
                onLangChange={setLang}
              />
            )}
          </main>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] ${
          theme === 'dark' ? 'text-white/35' : 'text-[#8a8a96]/80'
        }`}
      >
        PackGate UI Demo · 对标 Magpie 路由 + CC Switch Provider
        {lang === 'en' ? ' · EN partial' : ''}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <DesktopApp />
    </ToastProvider>
  )
}
