import { useState } from 'react'
import {
  AppWindow,
  BookOpen,
  History,
  KeyRound,
  Layers,
  Package,
  Puzzle,
  Route,
  Server,
  Settings,
  Sparkles,
  BarChart3,
  Store,
  MessageSquare,
  FlaskConical,
} from 'lucide-react'
import { ToastProvider, useToast } from './lib/toast'
import {
  APPS,
  CORE_NAV,
  EXTRA_NAV,
  GLOBAL_NAV,
  NAV_LABEL,
  type AgentId,
  type NavId,
} from './lib/types'
import { ProvidersView } from './views/ProvidersView'
import { RoutingView } from './views/RoutingView'
import { PackMarketView } from './views/PackMarketView'
import { McpView } from './views/McpView'
import { SkillsView } from './views/SkillsView'
import { PromptsView } from './views/PromptsView'
import { SessionsView } from './views/SessionsView'
import { AuthView } from './views/AuthView'
import { UsageView } from './views/UsageView'
import { AppsView } from './views/AppsView'
import { GatewayView } from './views/GatewayView'
import { SettingsView } from './views/SettingsView'
import { PluginsView } from './views/PluginsView'
import { LibraryView } from './views/LibraryView'
import { CompositeView } from './views/CompositeView'
import { PiChatView } from './views/PiChatView'
import { PlaygroundView } from './views/PlaygroundView'

const ICONS: Record<string, typeof Route> = {
  mcp: Server,
  skills: Sparkles,
  prompts: BookOpen,
  sessions: History,
  auth: KeyRound,
  usage: BarChart3,
  routing: Route,
  packs: Store,
  composite: Layers,
  pi: MessageSquare,
  play: FlaskConical,
  gateway: Package,
  apps: AppWindow,
  settings: Settings,
  plugins: Puzzle,
}

function Shell() {
  const { toast } = useToast()
  const [nav, setNav] = useState<NavId>('packs')
  const [app, setApp] = useState<AgentId>('claude-code')
  const [proxyOn, setProxyOn] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [addSignal, setAddSignal] = useState(0)

  const go = (id: NavId) => {
    setNav(id)
    toast(NAV_LABEL[id])
  }

  const title =
    nav === 'providers'
      ? APPS.find((a) => a.id === app)?.label ?? 'PackGate'
      : NAV_LABEL[nav]
  const subtitle =
    nav === 'providers'
      ? '供应商'
      : nav === 'packs'
        ? '本地能力包'
        : nav === 'composite'
          ? '云 + 本地入口'
          : nav === 'pi-chat'
            ? '内置 Pi Agent'
            : nav === 'playground'
              ? 'LocalAI 风格试跑'
              : undefined

  const showAdd =
    nav === 'providers' ||
    nav === 'mcp' ||
    nav === 'skills' ||
    nav === 'prompts' ||
    nav === 'packs' ||
    nav === 'composite'

  const addLabel =
    nav === 'providers'
      ? '供应商'
      : nav === 'packs'
        ? 'Pack'
        : nav === 'composite'
          ? '组合'
          : NAV_LABEL[nav]

  return (
    <div
      className={`desktop-bg flex h-full min-h-screen w-full items-center justify-center p-6 sm:p-10 ${
        theme === 'dark' ? 'theme-dark' : ''
      }`}
    >
      <div
        className={`window-shell relative w-[min(980px,94vw)] ${theme === 'dark' ? 'theme-dark' : ''}`}
        style={{ height: 'min(700px, 88vh)' }}
      >
        <div className="win-chrome">
          <div className="traffic">
            <i className="r" />
            <i className="y" />
            <i className="g" />
          </div>
          <span className="title">PackGate</span>
        </div>

        <div className="shell-body">
          <aside className="sidebar">
            <div className="sb-brand">
              <span className="logo">P</span>
              PackGate
            </div>

            <div className="sb-group">应用</div>
            {APPS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="sb-item"
                data-on={nav === 'providers' && app === a.id}
                onClick={() => {
                  setApp(a.id)
                  setNav('providers')
                  toast(a.label)
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: a.color,
                    flex: 'none',
                  }}
                />
                {a.label}
              </button>
            ))}

            <div className="sb-core-block">
              <div className="sb-group">PackGate</div>
              {CORE_NAV.map((item) => {
                const Icon = ICONS[item.icon] ?? Store
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="sb-item core"
                    data-on={nav === item.id}
                    onClick={() => go(item.id)}
                  >
                    <Icon strokeWidth={1.7} />
                    {item.label}
                    <span className="core-mark">{item.hint}</span>
                  </button>
                )
              })}
            </div>

            <div className="sb-group">扩展</div>
            {EXTRA_NAV.map((item) => {
              const Icon = ICONS[item.icon] ?? Route
              return (
                <button
                  key={item.id}
                  type="button"
                  className="sb-item"
                  data-on={nav === item.id}
                  onClick={() => go(item.id)}
                >
                  <Icon strokeWidth={1.6} />
                  {item.label}
                </button>
              )
            })}

            <div className="sb-group">功能</div>
            {GLOBAL_NAV.map((item) => {
              const Icon = ICONS[item.icon] ?? Route
              return (
                <button
                  key={item.id}
                  type="button"
                  className="sb-item"
                  data-on={nav === item.id}
                  onClick={() => go(item.id)}
                >
                  <Icon strokeWidth={1.6} />
                  {item.label}
                  {item.id === 'usage' && (
                    <span className="badge">$12.4</span>
                  )}
                </button>
              )
            })}

            <div className="sb-foot">
              <button
                type="button"
                className="sb-item"
                data-on={nav === 'apps'}
                onClick={() => go('apps')}
              >
                <AppWindow strokeWidth={1.6} />
                应用
              </button>
              <button
                type="button"
                className="sb-item"
                data-on={nav === 'settings'}
                onClick={() => go('settings')}
              >
                <Settings strokeWidth={1.6} />
                设置
              </button>
            </div>
          </aside>

          <div className="main">
            <header className="page-header">
              <h1>{title}</h1>
              {subtitle && <span className="sub">{subtitle}</span>}
              <div className="spacer" />

              <button
                type="button"
                className="btn ghost"
                style={{ fontSize: 12 }}
                onClick={() => {
                  setProxyOn((v) => {
                    const n = !v
                    toast(n ? 'Proxy / 本地路由已开' : 'Proxy 已关')
                    return n
                  })
                }}
                title="本地路由 Proxy"
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: proxyOn ? 'var(--route)' : 'var(--fg-3)',
                  }}
                />
                Proxy {proxyOn ? '开' : '关'}
              </button>

              {showAdd && (
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    if (nav === 'providers') setAddSignal((n) => n + 1)
                    else if (nav === 'packs') toast('安装 Pack（Demo）')
                    else if (nav === 'composite') toast('新建组合模型（Demo）')
                    else toast(`添加 ${NAV_LABEL[nav]}`)
                  }}
                >
                  + 添加{addLabel}
                </button>
              )}

              <button
                type="button"
                className="btn icon"
                title="设置"
                onClick={() => go('settings')}
              >
                <Settings style={{ width: 16, height: 16 }} strokeWidth={1.6} />
              </button>
            </header>

            {nav === 'providers' && (
              <ProvidersView
                agent={app}
                onAgentChange={setApp}
                proxyOn={proxyOn}
                addSignal={addSignal}
              />
            )}
            {nav === 'routing' && <RoutingView agent={app} />}
            {nav === 'packs' && <PackMarketView />}
            {nav === 'composite' && <CompositeView />}
            {nav === 'pi-chat' && <PiChatView />}
            {nav === 'playground' && <PlaygroundView />}
            {nav === 'mcp' && <McpView />}
            {nav === 'skills' && <SkillsView />}
            {nav === 'prompts' && <PromptsView />}
            {nav === 'sessions' && <SessionsView />}
            {nav === 'auth' && <AuthView />}
            {nav === 'usage' && <UsageView />}
            {nav === 'apps' && <AppsView />}
            {nav === 'gateway' && <GatewayView on={proxyOn} />}
            {nav === 'plugins' && <PluginsView />}
            {nav === 'library' && <LibraryView />}
            {nav === 'settings' && (
              <SettingsView
                theme={theme}
                onThemeChange={setTheme}
                lang="zh"
                onLangChange={() => toast('语言')}
              />
            )}
          </div>
        </div>
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
