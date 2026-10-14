import { useState } from 'react'
import { useToast } from '../lib/toast'

export function GatewayView({ on }: { on: boolean }) {
  const { toast } = useToast()
  const [port] = useState('3425')
  return (
    <div className="content">
      <div className="list-card">
        <div className="list-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 560 }}>监听</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>127.0.0.1:{port}</div>
          </div>
          <span className={on ? 'pill' : 'pill soft'}>{on ? '开' : '关'}</span>
        </div>
        <div className="list-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 560 }}>兼容</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>OpenAI · Anthropic · Gemini</div>
          </div>
        </div>
        <div className="list-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 560 }}>环境变量</div>
            <div className="mono muted" style={{ marginTop: 4, lineHeight: 1.6 }}>
              OPENAI_BASE_URL=http://127.0.0.1:{port}/v1<br />
              OPENAI_API_KEY=packgate
            </div>
          </div>
          <button type="button" className="btn" onClick={() => toast('已复制')}>复制</button>
        </div>
      </div>
    </div>
  )
}
