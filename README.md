# PackGate Demo

Clickable **desktop-window UI demo** for PackGate — a local unified gateway that competes for the Agent “select model” entry, with Magpie-style visual routing and a Pack marketplace for heavy Skill+MCP capabilities (TTS / ASR / FFmpeg / Remotion / ReachFlow, etc.).

> Static Vite + React demo only. No Tauri / Rust gateway yet.

## Features (UI)

- Floating macOS-style window (~85vw × 78vh) on a desktop wallpaper
- Sidebar: 路由 · 组合模型 · Pack 市场 · MCP/Skills · 云 Provider · 用量 · 设置
- Routing view: strategy tabs + Agent → PackGate → cloud/local targets
- Pack install toggles, composite model ids, MCP/Skill switches, provider cards, usage bars
- Setting: prefer Agent’s own LLM when no cloud LLM is configured (default ON)

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output: `dist/` (Vercel framework: Vite).

## License

MIT
