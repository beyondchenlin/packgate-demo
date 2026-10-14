import { useState } from 'react'
import { ToastProvider, useToast } from './lib/toast'
import type { AgentId, NavId, ProfileId } from './lib/types'
import { NAV_LABEL } from './lib/types'
import { Sidebar } from './components/Sidebar'
import { TitleBar } from './components/TitleBar'
import { AgentsView } from './views/AgentsView'
import { SessionsView } from './views/SessionsView'
import { LibraryView } from './views/LibraryView'
import { PromptsView } from './views/PromptsView'
import { ProvidersView } from './views/ProvidersView'
import { RoutingView } from './views/RoutingView'
import { GatewayView } from './views/GatewayView'
import { CompositeView } from './views/CompositeView'
import { PackMarketView } from './views/PackMarketView'
import { McpView } from './views/McpView'
import { SkillsView } from './views/SkillsView'
import { PluginsView } from './views/PluginsView'
import { UsageView } from './views/UsageView'
import { AuthView } from './views/AuthView'
import { AppsView } from './views/AppsView'
import { SettingsView } from './views/SettingsView'

function DesktopApp() {
  const { toast } = useToast()
  const [nav, setNav] = useState<NavId>('routing')
  const [gatewayOn, setGatewayOn] = useState(true)
  const [agent, setAgent] = useState<AgentId>('claude-code')
  const [profile, setProfile] = useState<ProfileId>('default')
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [lang, setLang] = useState<'zh' | 'en'>('zh')

  return (
    <div
      className={`desktop-bg relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden p-5 sm:p-10 ${
        theme === 'dark' ? 'theme-dark' : ''
      }`}
    >
      <div
        className="window-shell relative flex w-[min(980px,90vw)] flex-col"
        style={{ height: 'min(700px, 84vh)' }}
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
          profile={profile}
          onProfileChange={setProfile}
        />

        <div className="flex min-h-0 flex-1">
          <Sidebar
            active={nav}
            onChange={(id) => {
              setNav(id)
              toast(NAV_LABEL[id])
            }}
          />
          <main className="min-w-0 flex-1 overflow-hidden bg-[#fafafa]">
            {!gatewayOn &&
              (nav === 'routing' ||
                nav === 'providers' ||
                nav === 'gateway' ||
                nav === 'agents') && (
                <div className="border-b border-[#f3e6c8] bg-[#fffbeb] px-4 py-1.5 text-[11px] text-[#92400e]">
                  网关已关闭 — Demo 仍可浏览；正式版将拒绝代理请求。
                </div>
              )}
            {nav === 'agents' && (
              <AgentsView agent={agent} onAgentChange={setAgent} />
            )}
            {nav === 'sessions' && <SessionsView />}
            {nav === 'library' && <LibraryView />}
            {nav === 'prompts' && <PromptsView />}
            {nav === 'providers' && (
              <ProvidersView
                agent={agent}
                onAgentChange={setAgent}
                gatewayOn={gatewayOn}
              />
            )}
            {nav === 'routing' && <RoutingView agent={agent} />}
            {nav === 'gateway' && <GatewayView on={gatewayOn} />}
            {nav === 'composite' && <CompositeView />}
            {nav === 'packs' && <PackMarketView />}
            {nav === 'mcp' && <McpView />}
            {nav === 'skills' && <SkillsView />}
            {nav === 'plugins' && <PluginsView />}
            {nav === 'usage' && <UsageView />}
            {nav === 'auth' && <AuthView />}
            {nav === 'apps' && <AppsView />}
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
        PackGate UI Demo · Magpie + CC Switch 全表面对标
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
