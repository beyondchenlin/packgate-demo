import { useState } from 'react'
import { ChevronDown, Settings } from 'lucide-react'
import { ToastProvider, useToast } from './lib/toast'
import {
  MORE_NAV,
  NAV_LABEL,
  PRIMARY_NAV,
  PROFILES,
  type AgentId,
  type NavId,
  type ProfileId,
} from './lib/types'
import { AgentsView } from './views/AgentsView'
import { ProvidersView } from './views/ProvidersView'
import { RoutingView } from './views/RoutingView'
import { GatewayView } from './views/GatewayView'
import { PackMarketView } from './views/PackMarketView'
import { UsageView } from './views/UsageView'
import { SessionsView } from './views/SessionsView'
import { McpView } from './views/McpView'
import { SkillsView } from './views/SkillsView'
import { PluginsView } from './views/PluginsView'
import { LibraryView } from './views/LibraryView'
import { PromptsView } from './views/PromptsView'
import { AuthView } from './views/AuthView'
import { AppsView } from './views/AppsView'
import { CompositeView } from './views/CompositeView'
import { SettingsView } from './views/SettingsView'

function Shell() {
  const { toast } = useToast()
  const [nav, setNav] = useState<NavId>('routing')
  const [gatewayOn, setGatewayOn] = useState(true)
  const [agent, setAgent] = useState<AgentId>('claude-code')
  const [profile, setProfile] = useState<ProfileId>('default')
  const [moreOpen, setMoreOpen] = useState(false)
  const [profOpen, setProfOpen] = useState(false)

  const go = (id: NavId) => {
    setNav(id)
    setMoreOpen(false)
    toast(NAV_LABEL[id])
  }

  const inMore = MORE_NAV.some((x) => x.id === nav)

  return (
    <div className="desktop-bg flex h-full min-h-screen w-full items-center justify-center p-6 sm:p-12">
      <div
        className="window-shell relative flex w-[min(960px,92vw)] flex-col"
        style={{ height: 'min(680px, 86vh)' }}
        onClick={() => {
          setMoreOpen(false)
          setProfOpen(false)
        }}
      >
        <header className="titlebar" onClick={(e) => e.stopPropagation()}>
          <div className="traffic">
            <i className="r" />
            <i className="y" />
            <i className="g" />
          </div>
          <span className="brand">PackGate</span>

          <nav className="topnav">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                data-on={nav === item.id}
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            ))}
            <div className="relative">
              <button
                type="button"
                data-on={inMore}
                onClick={(e) => {
                  e.stopPropagation()
                  setMoreOpen((v) => !v)
                  setProfOpen(false)
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
              >
                更多
                <ChevronDown style={{ width: 12, height: 12, opacity: 0.6 }} />
              </button>
              {moreOpen && (
                <div
                  className="more-menu"
                  style={{ left: 0, right: 'auto', minWidth: 140 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {MORE_NAV.map((item) => (
                    <button key={item.id} type="button" onClick={() => go(item.id)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="relative">
            <button
              type="button"
              className="btn ghost"
              style={{ fontSize: 12, padding: '4px 8px' }}
              onClick={(e) => {
                e.stopPropagation()
                setProfOpen((v) => !v)
                setMoreOpen(false)
              }}
            >
              {PROFILES.find((p) => p.id === profile)?.label}
              <ChevronDown style={{ width: 12, height: 12, opacity: 0.5 }} />
            </button>
            {profOpen && (
              <div className="more-menu" onClick={(e) => e.stopPropagation()}>
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProfile(p.id)
                      setProfOpen(false)
                      toast(`方案 · ${p.label}`)
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn ghost"
            style={{ fontSize: 12, padding: '4px 8px' }}
            onClick={() => {
              setGatewayOn((v) => {
                const n = !v
                toast(n ? '网关 · :3425' : '网关已关')
                return n
              })
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 99,
                background: gatewayOn ? '#189a58' : '#b9b9c2',
                display: 'inline-block',
              }}
            />
            {gatewayOn ? ':3425' : '关'}
          </button>

          <button
            type="button"
            className="icon-btn"
            title="设置"
            onClick={() => go('settings')}
          >
            <Settings style={{ width: 15, height: 15 }} strokeWidth={1.6} />
          </button>
        </header>

        <main className="relative min-h-0 flex-1 overflow-hidden">
          {nav === 'agents' && (
            <AgentsView agent={agent} onAgentChange={setAgent} />
          )}
          {nav === 'providers' && (
            <ProvidersView agent={agent} onAgentChange={setAgent} />
          )}
          {nav === 'routing' && <RoutingView agent={agent} />}
          {nav === 'gateway' && <GatewayView on={gatewayOn} />}
          {nav === 'packs' && <PackMarketView />}
          {nav === 'usage' && <UsageView />}
          {nav === 'sessions' && <SessionsView />}
          {nav === 'mcp' && <McpView />}
          {nav === 'skills' && <SkillsView />}
          {nav === 'plugins' && <PluginsView />}
          {nav === 'library' && <LibraryView />}
          {nav === 'prompts' && <PromptsView />}
          {nav === 'auth' && <AuthView />}
          {nav === 'apps' && <AppsView />}
          {nav === 'composite' && <CompositeView />}
          {nav === 'settings' && (
            <SettingsView
              theme="light"
              onThemeChange={() => toast('主题（Demo）')}
              lang="zh"
              onLangChange={() => toast('语言（Demo）')}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
