export type NavId =
  | 'routing'
  | 'composite'
  | 'packs'
  | 'mcp'
  | 'providers'
  | 'usage'
  | 'settings'

export type StrategyId = 'intent' | 'smart' | 'order' | 'rotate' | 'usage'

export type AgentId = 'claude-code' | 'codex' | 'workbuddy' | 'gemini'

export const NAV_ITEMS: { id: NavId; label: string; icon: string }[] = [
  { id: 'routing', label: '路由', icon: 'route' },
  { id: 'composite', label: '组合模型', icon: 'layers' },
  { id: 'packs', label: 'Pack 市场', icon: 'store' },
  { id: 'mcp', label: 'MCP / Skills', icon: 'puzzle' },
  { id: 'providers', label: '云 Provider', icon: 'cloud' },
  { id: 'usage', label: '用量', icon: 'bar' },
  { id: 'settings', label: '设置', icon: 'settings' },
]

export const STRATEGIES: { id: StrategyId; label: string; helper: string }[] = [
  {
    id: 'intent',
    label: '按意图',
    helper:
      '每轮对话开始时，用小模型判断意图，再落到匹配目标；同一轮含 tool 回合保持绑定。',
  },
  {
    id: 'smart',
    label: '智能',
    helper: '综合延迟、可用性与能力自动选目标；失败时按回退链切换。',
  },
  {
    id: 'order',
    label: '按顺序',
    helper: '按列表从上到下尝试，第一个可用的目标承接本轮请求。',
  },
  {
    id: 'rotate',
    label: '轮流',
    helper: '在目标之间轮询分发，摊平用量与速率限制。',
  },
  {
    id: 'usage',
    label: '用量少优先',
    helper: '优先选择本周期用量更少的目标，适合配额敏感场景。',
  },
]

export const AGENTS: { id: AgentId; label: string }[] = [
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'codex', label: 'Codex' },
  { id: 'workbuddy', label: 'WorkBuddy' },
  { id: 'gemini', label: 'Gemini' },
]
