# PackGate × Magpie × CC Switch 功能对照

来源：仓库源码（非营销文案）
- Magpie：`yetone/magpie` → `internal/gui/assets/index.html` 导航、`app.js` / `routing.js` / `plugins.js`
- CC Switch：`farion1231/cc-switch` → `src/lib/navigation.ts`、`components/shell/Sidebar.tsx`、`components/providers/ProviderCardActions.tsx`

状态约定：✅ 已有可点击 mock · 🟡 有入口但偏浅 · ❌ 未做

## 主导航 / 页面

| 表面 | Magpie | CC Switch | PackGate Demo |
|------|--------|-----------|---------------|
| Agents（每 Agent 选模型） | ✅ `data-view=agents` | —（侧栏按 App 进供应商页） | ✅ Agents |
| Providers / 供应商 | ✅ | ✅ 按 App + 直连/路由/聚合 | ✅ + 模式标签 |
| Routing / 路由组 + 意图 | ✅ 节点流 + 意图规则 | 设置→本地路由 / 故障转移 | ✅ Magpie 级路由页 |
| Gateway / 网关 | ✅ | 设置→本地路由 | ✅ Gateway |
| Sessions / 会话 | ✅ | ✅ | ✅ |
| Library / 资料库 | ✅ | — | ✅ |
| Plugins / 插件 | ✅ npm/中间件 | — | ✅ |
| MCP | —（插件侧） | ✅ | ✅（独立页） |
| Skills + 发现 | — | ✅ skills / skillsDiscovery | ✅ |
| 提示词 Prompts | — | ✅ | ✅ |
| 用量 Usage | ✅ 额度+热力图+日志 | ✅ 热力图+日志 | ✅ |
| 授权中心 Auth | 订阅在 Provider | ✅ Copilot/ChatGPT/xAI | ✅ |
| 应用 Apps（安装/显示） | — | ✅ | ✅ |
| 方案 Profiles | ✅ 顶栏 | 项目切换（设置开启） | ✅ 顶栏 |
| Pack 市场 | — | — | ✅（差异化） |
| 组合模型 | 路由组 | 聚合模式 | ✅ |
| 设置 | 8 Tab | 6 Section | ✅ 合并 Tab |

## Provider 卡片操作（对标 CC Switch `ProviderCardActions`）

| 操作 | CC Switch | PackGate Demo |
|------|-----------|---------------|
| 启用 / 切换 / 开始路由 | ✅ | ✅ |
| 上移 / 下移（故障转移队列） | ✅ | ✅ |
| 编辑 | ✅ | ✅ |
| ⋯ 复制 | ✅ | ✅ |
| ⋯ 检测连通 | ✅ | ✅ |
| ⋯ 配置用量查询 | ✅ | ✅ |
| ⋯ 打开终端 | ✅ | ✅ |
| ⋯ 删除 | ✅ | ✅ |
| 聚合：添加/移除/设为默认 | ✅ | ✅ |
| 卡片额度/余额展示 | ✅ | ✅ |
| 添加供应商（预设搜索） | ✅ | ✅ |

## Magpie 路由能力

| 能力 | Magpie | PackGate Demo |
|------|--------|---------------|
| 策略：手动/智能/顺序/轮询/用量 | ✅ | ✅（含意图） |
| 意图规则面板 | ✅ | ✅ |
| Agent → 网关 → 目标节点流 | ✅ | ✅ |
| 本地目标（Pack）并列 | 本地模型 | ✅ ASR/TTS/剪辑等 |
| 路由决策轨迹 | ✅ | ✅ mock |
| 隐藏账号（截图） | ✅ | ✅ |

## 设置分区

| 分区 | Magpie | CC Switch | PackGate |
|------|--------|-----------|----------|
| 通用 | ✅ | ✅ | ✅ |
| 额度/用量显示 | ✅ Allowances | —（用量页） | ✅ |
| 网络与共享 | ✅ | ✅ network | ✅ |
| 模型 | ✅ | — | ✅ |
| 隐私 | ✅ | — | ✅ |
| 可观测 | ✅ otel | — | ✅ |
| 同步与备份 | ✅ | ✅ data/WebDAV | ✅ |
| 应用配置 | — | ✅ appConfig | ✅ |
| 本地路由参数 | — | ✅ routing | ✅ |
| 关于 | ✅ | ✅ | ✅ |

## PackGate 独有（对标之上）

| 能力 | 说明 |
|------|------|
| Pack 市场 | 重型本地 Skill+MCP 一键安装（TTS/ASR/ReachFlow/视频等） |
| 组合模型 = 云 LLM + 本地 Pack | Agent 选一个入口即可 |
| Agent 自带 LLM 优先 | 后台未配云模型时走入口额度 |

