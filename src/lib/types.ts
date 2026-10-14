export type NavId =
  | 'providers'
  | 'routing'
  | 'packs'
  | 'pi-chat'
  | 'playground'
  | 'mcp'
  | 'skills'
  | 'prompts'
  | 'sessions'
  | 'auth'
  | 'usage'
  | 'apps'
  | 'gateway'
  | 'plugins'
  | 'library'
  | 'composite'
  | 'settings'

export type AgentId =
  | 'claude-code'
  | 'codex'
  | 'workbuddy'
  | 'gemini'
  | 'cursor-cli'
  | 'opencode'

export const APPS: { id: AgentId; label: string; color: string }[] = [
  { id: 'claude-code', label: 'Claude Code', color: '#d97706' },
  { id: 'codex', label: 'Codex', color: '#18181b' },
  { id: 'workbuddy', label: 'WorkBuddy', color: '#2563eb' },
  { id: 'gemini', label: 'Gemini CLI', color: '#4285f4' },
  { id: 'cursor-cli', label: 'Cursor CLI', color: '#0ea5e9' },
  { id: 'opencode', label: 'OpenCode', color: '#64748b' },
]

/** PackGate 核心：侧栏一级 */
export const CORE_NAV: { id: NavId; label: string; icon: string; hint: string }[] = [
  { id: 'packs', label: 'Pack 市场', icon: 'packs', hint: '核心' },
  { id: 'composite', label: '组合模型', icon: 'composite', hint: '核心' },
  { id: 'pi-chat', label: 'Pi 对话', icon: 'pi', hint: '内置' },
  { id: 'playground', label: '本地试跑', icon: 'play', hint: '试跑' },
]

export const GLOBAL_NAV: { id: NavId; label: string; icon: string }[] = [
  { id: 'mcp', label: 'MCP', icon: 'mcp' },
  { id: 'skills', label: 'Skills', icon: 'skills' },
  { id: 'prompts', label: '提示词', icon: 'prompts' },
  { id: 'sessions', label: '会话', icon: 'sessions' },
  { id: 'auth', label: '授权中心', icon: 'auth' },
  { id: 'usage', label: '用量统计', icon: 'usage' },
]

export const EXTRA_NAV: { id: NavId; label: string; icon: string }[] = [
  { id: 'routing', label: '路由图', icon: 'routing' },
  { id: 'gateway', label: '网关', icon: 'gateway' },
]

export const NAV_LABEL: Record<NavId, string> = {
  providers: '供应商',
  routing: '路由图',
  packs: 'Pack 市场',
  'pi-chat': 'Pi 对话',
  playground: '本地试跑',
  mcp: 'MCP',
  skills: 'Skills',
  prompts: '提示词',
  sessions: '会话',
  auth: '授权中心',
  usage: '用量统计',
  apps: '应用',
  gateway: '网关',
  plugins: '插件',
  library: '资料库',
  composite: '组合模型',
  settings: '设置',
}

export type StrategyId = 'intent' | 'smart' | 'order' | 'rotate' | 'usage' | 'manual'

export const STRATEGIES: { id: StrategyId; label: string; helper: string }[] = [
  { id: 'smart', label: '智能', helper: '优先额度充足的账号；失败则回退。' },
  { id: 'intent', label: '按意图', helper: '每轮判意图后落到规则目标。' },
  { id: 'order', label: '按顺序', helper: '从上到下第一个能答的承接。' },
  { id: 'rotate', label: '轮流', helper: '成员间轮询。' },
  { id: 'usage', label: '用量少优先', helper: '本周期用量更少的优先。' },
  { id: 'manual', label: '手动', helper: '固定打到选中模型。' },
]

export const AGENTS = APPS.map((a) => ({
  ...a,
  installed: a.id !== 'opencode',
}))

export const COMPOSITE_OPTIONS = [
  '组合 · 视频多模态',
  '组合 · 爬取研究',
  '组合 · 省钱编码',
  'Pack · 本地 TTS',
  'Pack · 本地 ASR',
  'Pack · ReachFlow',
  '本地 · Agent 自带额度',
]
