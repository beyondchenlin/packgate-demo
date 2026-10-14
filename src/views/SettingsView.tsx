import type { ReactNode } from 'react'
import { useState } from 'react'
import { useToast } from '../lib/toast'

const TABS = [
  { id: 'general', label: '通用' },
  { id: 'allowance', label: '额度显示' },
  { id: 'appConfig', label: '应用配置' },
  { id: 'routing', label: '本地路由' },
  { id: 'network', label: '网络与共享' },
  { id: 'models', label: '模型' },
  { id: 'privacy', label: '隐私' },
  { id: 'otel', label: '可观测' },
  { id: 'sync', label: '同步备份' },
  { id: 'about', label: '关于' },
] as const

type TabId = (typeof TABS)[number]['id']

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
  const [tab, setTab] = useState<TabId>('general')
  const [projectSwitch, setProjectSwitch] = useState(false)
  const [tray, setTray] = useState(true)
  const [autoStart, setAutoStart] = useState(false)
  const [discoverAccounts, setDiscoverAccounts] = useState(true)
  const [telemetry, setTelemetry] = useState(true)

  return (
    <div className="flex h-full">
      <div className="w-[128px] shrink-0 overflow-y-auto border-r border-[#ebebef] py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`mx-1.5 mb-0.5 flex w-[calc(100%-12px)] rounded-md px-2 py-1.5 text-left text-[11.5px] ${
              tab === t.id
                ? 'bg-white font-medium text-[#1a1a1c] shadow-sm'
                : 'text-[#5c5c66] hover:bg-white/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        {tab === 'general' && (
          <Section title="通用（Magpie + CC Switch）">
            <Row
              label="主题"
              control={
                <Seg
                  value={theme}
                  options={[
                    ['light', '浅色'],
                    ['dark', '深色'],
                  ]}
                  onChange={(v) => {
                    onThemeChange(v as 'dark' | 'light')
                    toast(`主题：${v}`)
                  }}
                />
              }
            />
            <Row
              label="语言"
              control={
                <Seg
                  value={lang}
                  options={[
                    ['zh', '中文'],
                    ['en', 'EN'],
                  ]}
                  onChange={(v) => {
                    onLangChange(v as 'zh' | 'en')
                    toast(v === 'zh' ? '中文' : 'English')
                  }}
                />
              }
            />
            <ToggleRow
              label="开机自启"
              on={autoStart}
              set={(v) => {
                setAutoStart(v)
                toast(v ? '已开启自启' : '已关闭自启')
              }}
            />
            <ToggleRow
              label="菜单栏 / 托盘"
              on={tray}
              set={(v) => {
                setTray(v)
                toast(v ? '显示托盘' : '隐藏托盘')
              }}
            />
            <ToggleRow
              label="显示项目切换（CC Switch）"
              on={projectSwitch}
              set={(v) => {
                setProjectSwitch(v)
                toast(v ? '项目切换已显示' : '项目切换已隐藏')
              }}
            />
          </Section>
        )}

        {tab === 'allowance' && (
          <Section title="额度显示（Magpie Allowances）">
            <Row label="托盘展示" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('托盘额度：剩余 %')}>剩余 %</button>} />
            <Row label="Pace 数字" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('已开启 Pace')}>开启</button>} />
            <Row label="数字单位" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('缩写：12.4k')}>缩写</button>} />
          </Section>
        )}

        {tab === 'appConfig' && (
          <Section title="应用配置（CC Switch）">
            {['Claude Code 目录', 'Codex 配置路径', 'WorkBuddy 数据目录'].map((n) => (
              <Row
                key={n}
                label={n}
                control={
                  <button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast(`选择 ${n}`)}>
                    浏览…
                  </button>
                }
              />
            ))}
          </Section>
        )}

        {tab === 'routing' && (
          <Section title="本地路由参数（CC Switch）">
            <Row label="监听地址" control={<code className="text-[11px]">127.0.0.1:3425</code>} />
            <Row label="故障转移冷却" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('冷却 30s')}>30s</button>} />
            <Row label="熔断阈值" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('连续失败 3 次')}>3</button>} />
            <Row label="健康检查" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('每 60s')}>60s</button>} />
          </Section>
        )}

        {tab === 'network' && (
          <Section title="网络与共享（Magpie）">
            <Row label="HTTP 代理" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('配置代理')}>配置</button>} />
            <Row label="远程 PackGate" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('连接远程实例')}>连接</button>} />
            <Row label="允许局域网" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('仅本机')}>仅本机</button>} />
          </Section>
        )}

        {tab === 'models' && (
          <Section title="模型（Magpie）">
            <ToggleRow label="模型 id 不带 provider 前缀" on={true} set={() => toast('已切换')} />
            <Row label="禁用模型列表" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('编辑禁用列表')}>编辑</button>} />
          </Section>
        )}

        {tab === 'privacy' && (
          <Section title="隐私（Magpie）">
            <ToggleRow
              label="发现订阅账号"
              on={discoverAccounts}
              set={(v) => {
                setDiscoverAccounts(v)
                toast(v ? '允许读取本地订阅' : '已关闭订阅发现')
              }}
            />
            <ToggleRow
              label="匿名用量统计"
              on={telemetry}
              set={(v) => {
                setTelemetry(v)
                toast(v ? '已开启遥测' : '已关闭遥测')
              }}
            />
          </Section>
        )}

        {tab === 'otel' && (
          <Section title="可观测（Magpie Observability）">
            <Row label="OTLP Endpoint" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('配置 OTLP')}>配置</button>} />
            <Row label="追踪采样" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('采样 10%')}>10%</button>} />
          </Section>
        )}

        {tab === 'sync' && (
          <Section title="同步与备份（Magpie + CC Switch WebDAV）">
            <Row label="导出备份" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('已导出 JSON 备份')}>导出</button>} />
            <Row label="导入备份" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('选择备份文件')}>导入</button>} />
            <Row label="WebDAV 同步" control={<button type="button" className="text-[12px] text-[#2f6fed]" onClick={() => toast('配置 WebDAV')}>配置</button>} />
          </Section>
        )}

        {tab === 'about' && (
          <Section title="关于">
            <div className="text-[13px] font-semibold">PackGate Demo</div>
            <div className="mt-1 text-[12px] leading-relaxed text-[#6b6b76]">
              MIT · 对标 Magpie 路由网关 + CC Switch 供应商/MCP/Skills 管理，叠加 Pack
              市场（重型本地 Skill+MCP）。外观 Demo，逻辑以后端为准。
            </div>
            <button
              type="button"
              className="mt-3 text-[12px] text-[#2f6fed]"
              onClick={() => toast('检查更新（Demo）')}
            >
              检查更新
            </button>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[12px] font-semibold text-[#1a1a1c]">{title}</div>
      <div className="space-y-1 rounded-xl border border-[#ebebef] bg-white p-2">{children}</div>
    </div>
  )
}

function Row({ label, control }: { label: string; control: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-[#fafafa]">
      <span className="text-[12px] text-[#1a1a1c]">{label}</span>
      {control}
    </div>
  )
}

function ToggleRow({
  label,
  on,
  set,
}: {
  label: string
  on: boolean
  set: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-[#fafafa]"
    >
      <span className="text-[12px] text-[#1a1a1c]">{label}</span>
      <span
        className={`h-5 w-9 rounded-full p-0.5 transition ${on ? 'bg-[#2f6fed]' : 'bg-[#d4d4dc]'}`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${on ? 'translate-x-4' : ''}`}
        />
      </span>
    </button>
  )
}

function Seg({
  value,
  options,
  onChange,
}: {
  value: string
  options: [string, string][]
  onChange: (v: string) => void
}) {
  return (
    <div className="seg-track flex">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`seg-item rounded-[6px] px-2 py-[3px] text-[11px] ${
            value === id ? 'bg-white font-medium shadow-sm' : 'text-[#6b6b76]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
