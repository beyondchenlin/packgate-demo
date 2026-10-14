import { useState } from 'react'
import { useToast } from '../lib/toast'

const TABS = [
  ['general', '通用'],
  ['routing', '本地路由'],
  ['network', '网络'],
  ['privacy', '隐私'],
  ['sync', '备份'],
  ['about', '关于'],
] as const

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
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('general')
  return (
    <div className="page">
      <div className="page-head">
        <h1>设置</h1>
        <p>少而够用</p>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div className="card" style={{ width: 140, flex: 'none', padding: 6 }}>
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                border: 0,
                background: tab === id ? 'var(--pill)' : 'transparent',
                borderRadius: 8,
                padding: '8px 10px',
                font: 'inherit',
                fontSize: 12.5,
                fontWeight: tab === id ? 560 : 450,
                color: 'var(--fg)',
                cursor: 'default',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="card" style={{ flex: 1 }}>
          {tab === 'general' && (
            <>
              <div className="row">
                <span style={{ flex: 1 }}>主题</span>
                <div className="seg">
                  <button type="button" data-on={theme==='light'} onClick={() => onThemeChange('light')}>浅色</button>
                  <button type="button" data-on={theme==='dark'} onClick={() => onThemeChange('dark')}>深色</button>
                </div>
              </div>
              <div className="row">
                <span style={{ flex: 1 }}>语言</span>
                <div className="seg">
                  <button type="button" data-on={lang==='zh'} onClick={() => onLangChange('zh')}>中文</button>
                  <button type="button" data-on={lang==='en'} onClick={() => onLangChange('en')}>EN</button>
                </div>
              </div>
            </>
          )}
          {tab === 'routing' && (
            <>
              <div className="row"><span style={{ flex: 1 }}>监听</span><span className="mono muted">127.0.0.1:3425</span></div>
              <div className="row"><span style={{ flex: 1 }}>故障转移冷却</span><button type="button" className="btn ghost" onClick={() => toast('30s')}>30s</button></div>
            </>
          )}
          {tab === 'network' && (
            <div className="row"><span style={{ flex: 1 }}>HTTP 代理</span><button type="button" className="btn" onClick={() => toast('配置')}>配置</button></div>
          )}
          {tab === 'privacy' && (
            <div className="row"><span style={{ flex: 1 }}>发现订阅账号</span><button type="button" className="btn" onClick={() => toast('已切换')}>开</button></div>
          )}
          {tab === 'sync' && (
            <>
              <div className="row"><span style={{ flex: 1 }}>导出备份</span><button type="button" className="btn" onClick={() => toast('导出')}>导出</button></div>
              <div className="row"><span style={{ flex: 1 }}>WebDAV</span><button type="button" className="btn" onClick={() => toast('配置')}>配置</button></div>
            </>
          )}
          {tab === 'about' && (
            <div className="row">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 560 }}>PackGate Demo</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>MIT · 对标 Magpie / CC Switch 的外观 Demo</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
