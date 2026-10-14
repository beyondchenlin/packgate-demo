import { useState } from 'react'
import { AGENTS, STRATEGIES, type AgentId, type StrategyId } from '../lib/types'
import { useToast } from '../lib/toast'

const DEST = [
  { id: 'ds', name: 'DeepSeek', model: 'deepseek-v3', state: 'on' as const, note: '回答中…' },
  { id: 'or', name: 'OpenRouter', model: 'gemini-2.5-pro', state: 'on' as const, note: '一个 Key' },
  { id: 'glm', name: '智谱 GLM', model: 'glm-4.6', state: 'idle' as const, note: '一个 Key' },
  { id: 'tts', name: '本地 TTS', model: 'pack/tts', state: 'idle' as const, note: 'Pack' },
  { id: 'asr', name: '本地 ASR', model: 'pack/asr', state: 'idle' as const, note: 'Pack' },
  { id: 'kimi', name: 'Kimi', model: 'kimi-k2', state: 'rest' as const, note: '额度低' },
]

const GROUPS = [
  { id: 'video', name: '视频多模态', slug: 'group/video', members: 'Opus · TTS · ASR · FFmpeg · Remotion', strat: '按意图' },
  { id: 'daily', name: 'Daily coding', slug: 'group/daily-coding', members: 'DeepSeek · GLM · Kimi', strat: '智能' },
  { id: 'cheap', name: 'Cheap and fast', slug: 'group/cheap', members: 'DeepSeek · 本地额度', strat: '按顺序' },
]

const STEPS = [
  '新一轮开始 · 意图=编写测试',
  '规则 #2 命中 → glm-4.6',
  '同轮 tool 跟绑保持',
]

export function RoutingView({ agent }: { agent: AgentId }) {
  const { toast } = useToast()
  const [strategy, setStrategy] = useState<StrategyId>('smart')
  const [sel, setSel] = useState('ds')
  const helper = STRATEGIES.find((s) => s.id === strategy)?.helper

  return (
    <div className="page">
      <div className="page-head">
        <h1>路由</h1>
        <p>实时 · 网关正在做的决定</p>
        <button type="button" className="btn ghost" onClick={() => toast('账号已打码（Demo）')}>
          隐藏账号
        </button>
      </div>

      <div className="card card-pad" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 560 }}>
              视频多模态 · 路由组 · {AGENTS.filter((a) => a.installed).length} 个 Agent
            </div>
            <p className="muted" style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.5, maxWidth: 520 }}>
              {helper}
            </p>
          </div>
          <div className="seg">
            {STRATEGIES.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                data-on={strategy === s.id}
                onClick={() => {
                  setStrategy(s.id)
                  toast(s.label)
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rt">
          <div className="rt-col">
            {AGENTS.filter((a) => a.installed).slice(0, 4).map((a) => (
              <div key={a.id} className={`rt-src${a.id === agent ? ' on' : ''}`}>
                <span className="dot" style={{ background: a.color }} />
                <span style={{ flex: 1, fontWeight: a.id === agent ? 560 : 450 }}>{a.label}</span>
                <span className="faint" style={{ fontSize: 11 }}>group/video</span>
              </div>
            ))}
          </div>

          <div className="rt-hub">
            <div style={{ fontWeight: 600, fontSize: 13 }}>PackGate</div>
            <div className="addr">127.0.0.1:3425</div>
            <div style={{ marginTop: 10 }}>
              <span className="pill">{STRATEGIES.find((s) => s.id === strategy)?.label}</span>
            </div>
          </div>

          <div className="rt-col">
            {DEST.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`rt-dst${sel === d.id || d.state === 'on' ? ' on' : ''}`}
                style={{
                  textAlign: 'left',
                  cursor: 'default',
                  opacity: d.state === 'rest' ? 0.55 : 1,
                  borderStyle: d.state === 'rest' ? 'dashed' : undefined,
                }}
                onClick={() => {
                  setSel(d.id)
                  toast(d.name)
                }}
              >
                <span className="dot" />
                <span style={{ minWidth: 0 }}>
                  <b style={{ fontWeight: 560, display: 'block' }}>{d.name}</b>
                  <span className="mono muted">{d.model}</span>
                </span>
                <em>{d.note}</em>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 28,
            marginTop: 18,
            paddingTop: 14,
            borderTop: '0.5px solid var(--line)',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>最近一次怎么路由的</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {STEPS.map((s, i) => (
                <li
                  key={i}
                  style={{
                    position: 'relative',
                    paddingLeft: 16,
                    fontSize: 12.5,
                    color: 'var(--fg-2)',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 4,
                      top: 6,
                      width: 5,
                      height: 5,
                      borderRadius: 99,
                      background: i === 1 ? 'var(--fg)' : 'var(--muted)',
                    }}
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            {[
              ['8', '请求'],
              ['2', '换手'],
              ['0', '错误'],
            ].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 650, letterSpacing: '-0.02em' }}>{n}</div>
                <div className="muted" style={{ fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '0.5px solid var(--line-2)',
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>路由组</span>
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 'auto' }}
            onClick={() => toast('新建组')}
          >
            新建组
          </button>
        </div>
        {GROUPS.map((g) => (
          <div key={g.id} className="row">
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 560, fontSize: 13 }}>{g.name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                <span className="mono">{g.slug}</span>
                <span> · {g.members}</span>
              </div>
            </div>
            <span className={g.strat === '智能' || g.strat === '按意图' ? 'pill' : 'pill soft'}>
              {g.strat}
            </span>
            <button type="button" className="btn ghost" onClick={() => toast(`编辑 ${g.name}`)}>
              编辑
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
