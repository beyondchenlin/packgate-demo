import {
  Route,
  Layers,
  Store,
  Puzzle,
  Cloud,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { NavId } from '../lib/types'
import { NAV_ITEMS } from '../lib/types'

const ICONS = {
  route: Route,
  layers: Layers,
  store: Store,
  puzzle: Puzzle,
  cloud: Cloud,
  bar: BarChart3,
  settings: Settings,
} as const

export function Sidebar({
  active,
  onChange,
}: {
  active: NavId
  onChange: (id: NavId) => void
}) {
  return (
    <aside className="flex w-[168px] shrink-0 flex-col border-r border-slate-200/80 bg-slate-50/90 py-3">
      <div className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
        PackGate
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS]
          const selected = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition ${
                selected
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${selected ? 'text-blue-600' : 'text-slate-400'}`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="mt-auto border-t border-slate-200/80 px-3 pt-3 text-[11px] text-slate-400">
        Demo · MIT
      </div>
    </aside>
  )
}
