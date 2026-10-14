export type NavId =
  | 'agents'
  | 'providers'
  | 'routing'
  | 'gateway'
  | 'packs'
  | 'usage'
  | 'sessions'
  | 'mcp'
  | 'skills'
  | 'plugins'
  | 'library'
  | 'prompts'
  | 'auth'
  | 'apps'
  | 'composite'
  | 'settings'

/** Magpie 式顶栏主入口：少而干净 */
export const PRIMARY_NAV: { id: NavId; label: string }[] = [
  { id: 'agents', label: 'Agents' },
  { id: 'providers', label: '供应商' },
  { id: 'routing', label: '路由' },
  { id: 'gateway', label: '网关' },
  { id: 'packs', label: 'Pack' },
  { id: 'usage', label: '用量' },
  { id: 'sessions', label: '会话' },
]

/** 次要入口收进「更多」，避免侧栏堆砌 */
export const MORE_NAV: { id: NavId; label: string }[] = [
  { id: 'mcp', label: 'MCP' },
  { id: 'skills', label: 'Skills' },
  { id: 'plugins', label: '插件' },
  { id: 'library', label: '资料库' },
  { id: 'prompts', label: '提示词' },
  { id: 'auth', label: '授权中心' },
  { id: 'apps', label: '应用' },
  { id: 'composite', label: '组合模型' },
]

export const NAV_LABEL: Record<NavId, string> = {
  agents: 'Agents',
  providers: '供应商',
  routing: '路由',
  gateway: '网关',
  packs: 'Pack',
  usage: '用量',
  sessions: '会话',
  mcp: 'MCP',
  skills: 'Skills',
  plugins: '插件',
  library: '资料库',
  prompts: '提示词',
  auth: '授权中心',
  apps: '应用',
  composite: '组合模型',
  settings: '设置',
}

export type StrategyId = 'intent' | 'smart' | 'order' | 'rotate' | 'usage' | 'manual'

export type AgentId =
  | 'claude-code'
  | 'codex'
  | 'workbuddy'
  | 'gemini'
  | 'opencode'
  | 'cursor-cli'

export const STRATEGIES: { id: StrategyId; label: string; helper: string }[] = [
  { id: 'smart', label: '智能', helper: '优先额度充足的账号；失败则按成员顺序回退。' },
  { id: 'intent', label: '按意图', helper: '每轮新消息判意图后落到规则目标；同轮含 tool 跟绑。' },
  { id: 'order', label: '按顺序', helper: '成员从上到下，第一个能答的承接。' },
  { id: 'rotate', label: '轮流', helper: '成员间轮询分发。' },
  { id: 'usage', label: '用量少优先', helper: '本周期用量更少的优先。' },
  { id: 'manual', label: '手动', helper: '固定打到组里选中的模型。' },
]

export const AGENTS: { id: AgentId; label: string; installed: boolean; color: string }[] = [
  { id: 'claude-code', label: 'Claude Code', installed: true, color: '#d97706' },
  { id: 'codex', label: 'Codex', installed: true, color: '#111827' },
  { id: 'workbuddy', label: 'WorkBuddy', installed: true, color: '#2563eb' },
  { id: 'gemini', label: 'Gemini CLI', installed: true, color: '#4285f4' },
  { id: 'cursor-cli', label: 'Cursor CLI', installed: true, color: '#0ea5e9' },
  { id: 'opencode', label: 'OpenCode', installed: false, color: '#64748b' },
]

export type ProfileId = 'default' | 'cheap' | 'focus' | 'video'

export const PROFILES: { id: ProfileId; label: string }[] = [
  { id: 'default', label: '默认' },
  { id: 'cheap', label: '省钱' },
  { id: 'focus', label: '专注' },
  { id: 'video', label: '视频多模态' },
]
