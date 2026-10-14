import {
  Terminal,
  History,
  BookMarked,
  FileText,
  Cloud,
  Route,
  Server,
  Layers,
  Store,
  Puzzle,
  Sparkles,
  Package,
  BarChart3,
  KeyRound,
  AppWindow,
  Settings,
} from 'lucide-react'
import type { NavId } from '../lib/types'
import { NAV_GROUPS } from '../lib/types'

const ICONS: Record<string, typeof Route> = {
  agents: Terminal,
  sessions: History,
  library: BookMarked,
  prompts: FileText,
  providers: Cloud,
  routing: Route,
  gateway: Server,
  composite: Layers,
  packs: Store,
  mcp: Puzzle,
  skills: Sparkles,
  plugins: Package,
  usage: BarChart3,
  auth: KeyRound,
  apps: AppWindow,
  settings: Settings,
}

export function Sidebar({
  active,
  onChange,
}: {
  active: NavId
  onChange: (id: NavId) => void
}) {
  return (
    <aside className="sidebar-panel flex w-[158px] shrink-0 flex-col overflow-y-auto py-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-2">
          <div className="mb-1 px-3.5 text-[10px] font-medium tracking-[0.08em] text-[#9c9ca8]">
            {group.label}
          </div>
          <nav className="flex flex-col gap-[2px] px-1.5">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon] ?? Route
              const selected = active === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  data-active={selected}
                  onClick={() => onChange(item.id)}
                  className={`nav-item flex items-center gap-2 rounded-[7px] px-2.5 py-[6.5px] text-left text-[12px] tracking-tight ${
                    selected
                      ? 'font-medium text-[#1a1a1c]'
                      : 'font-normal text-[#5c5c66] hover:bg-white/55 hover:text-[#1a1a1c]'
                  }`}
                >
                  <Icon
                    className={`h-[14px] w-[14px] shrink-0 ${selected ? 'text-[#2f6fed]' : 'text-[#9c9ca8]'}`}
                    strokeWidth={selected ? 2.1 : 1.7}
                  />
                  <span className="truncate leading-none">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      ))}
      <div className="mt-auto px-3.5 pt-1 text-[10px] tracking-tight text-[#b0b0ba]">
        Demo · MIT · 对标齐全
      </div>
    </aside>
  )
}
