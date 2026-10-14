export type NavId =
  | 'agents'
  | 'sessions'
  | 'library'
  | 'providers'
  | 'routing'
  | 'gateway'
  | 'composite'
  | 'packs'
  | 'mcp'
  | 'skills'
  | 'plugins'
  | 'prompts'
  | 'usage'
  | 'auth'
  | 'apps'
  | 'settings'

export type StrategyId = 'intent' | 'smart' | 'order' | 'rotate' | 'usage' | 'manual'

export type AgentId =
  | 'claude-code'
  | 'codex'
  | 'workbuddy'
  | 'gemini'
  | 'opencode'
  | 'cursor-cli'

export type NavGroup = {
  label: string
  items: { id: NavId; label: string; icon: string }[]
}

/** Magpie 分组 + CC Switch 全局页 + PackGate 独有 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: '工作',
    items: [
      { id: 'agents', label: 'Agents', icon: 'agents' },
      { id: 'sessions', label: '会话', icon: 'sessions' },
      { id: 'library', label: '资料库', icon: 'library' },
      { id: 'prompts', label: '提示词', icon: 'prompts' },
    ],
  },
  {
    label: '模型',
    items: [
      { id: 'providers', label: '供应商', icon: 'providers' },
      { id: 'routing', label: '路由', icon: 'routing' },
      { id: 'gateway', label: '网关', icon: 'gateway' },
      { id: 'composite', label: '组合模型', icon: 'composite' },
    ],
  },
  {
    label: '能力',
    items: [
      { id: 'packs', label: 'Pack 市场', icon: 'packs' },
      { id: 'mcp', label: 'MCP', icon: 'mcp' },
      { id: 'skills', label: 'Skills', icon: 'skills' },
      { id: 'plugins', label: '插件', icon: 'plugins' },
    ],
  },
  {
    label: '洞察',
    items: [
      { id: 'usage', label: '用量', icon: 'usage' },
      { id: 'auth', label: '授权中心', icon: 'auth' },
    ],
  },
  {
    label: '系统',
    items: [
      { id: 'apps', label: '应用', icon: 'apps' },
      { id: 'settings', label: '设置', icon: 'settings' },
    ],
  },
]

export const NAV_LABEL: Record<NavId, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label])),
) as Record<NavId, string>

export const STRATEGIES: { id: StrategyId; label: string; helper: string }[] = [
  {
    id: 'intent',
    label: '按意图',
    helper: '每轮新消息用小模型判意图，再落到规则目标；同轮含 tool 跟绑。',
  },
  {
    id: 'smart',
    label: '智能',
    helper: '综合额度、延迟与可用性；接近用尽的账号排后。',
  },
  {
    id: 'order',
    label: '按顺序',
    helper: '成员从上到下，第一个能答的承接。',
  },
  {
    id: 'rotate',
    label: '轮流',
    helper: '成员间轮询，摊平限额。',
  },
  {
    id: 'usage',
    label: '用量少优先',
    helper: '本周期用量更少的优先。',
  },
  {
    id: 'manual',
    label: '手动',
    helper: '固定打到组卡片上选中的那个模型。',
  },
]

export const AGENTS: { id: AgentId; label: string; installed: boolean }[] = [
  { id: 'claude-code', label: 'Claude Code', installed: true },
  { id: 'codex', label: 'Codex', installed: true },
  { id: 'workbuddy', label: 'WorkBuddy', installed: true },
  { id: 'gemini', label: 'Gemini CLI', installed: true },
  { id: 'opencode', label: 'OpenCode', installed: false },
  { id: 'cursor-cli', label: 'Cursor CLI', installed: true },
]

export type ProfileId = 'default' | 'cheap' | 'focus' | 'video'

export const PROFILES: { id: ProfileId; label: string }[] = [
  { id: 'default', label: '默认' },
  { id: 'cheap', label: '省钱' },
  { id: 'focus', label: '专注' },
  { id: 'video', label: '视频多模态' },
]
