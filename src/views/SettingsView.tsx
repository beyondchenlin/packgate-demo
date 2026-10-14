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
    <div className="content">
      <div style={{ display: 'flex', gap: 14 }}>
        <div className="list-card" style={{ width: 140, flex: 'none' }}>
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="list-row"
              style={{
                width: '100%',
                border: 0,
                background: tab === id ? 'var(--bg-subtle)' : 'transparent',
                fontWeight: tab === id ? 560 : 450,
                cursor: 'default',
                textAlign: 'left',
              }}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="list-card" style={{ flex: 1 }}>
          {tab === 'general' && (
            <>
              <div className="list-row">
                <span style={{ flex: 1 }}>主题</span>
                <div className="seg">
                  <button type="button" data-on={theme==='light'} onClick={() => onThemeChange('light')}>浅色</button>
                  <button type="button" data-on={theme==='dark'} onClick={() => onThemeChange('dark')}>深色</button>
                </div>
              </div>
              <div className="list-row">
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
              <div className="list-row"><span style={{ flex: 1 }}>监听</span><span className="mono muted">127.0.0.1:3425</span></div>
              <div className="list-row"><span style={{ flex: 1 }}>故障转移冷却</span><button type="button" className="btn ghost" onClick={() => toast('30s')}>30s</button></div>
            </>
          )}
          {tab === 'network' && (
            <div className="list-row"><span style={{ flex: 1 }}>HTTP 代理</span><button type="button" className="btn" onClick={() => toast('配置')}>配置</button></div>
          )}
          {tab === 'privacy' && (
            <div className="list-row"><span style={{ flex: 1 }}>发现订阅账号</span><button type="button" className="btn" onClick={() => toast('切换')}>开</button></div>
          )}
          {tab === 'sync' && (
            <>
              <div className="list-row"><span style={{ flex: 1 }}>导出备份</span><button type="button" className="btn" onClick={() => toast('导出')}>导出</button></div>
              <div className="list-row"><span style={{ flex: 1 }}>WebDAV</span><button type="button" className="btn" onClick={() => toast('配置')}>配置</button></div>
            </>
          )}
          {tab === 'about' && (
            <div className="list-row">
              <div>
                <div style={{ fontWeight: 560 }}>PackGate Demo</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>MIT · 壳子对标 CC Switch</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
