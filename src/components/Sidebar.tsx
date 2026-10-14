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
    <aside className="sidebar-panel flex w-[148px] shrink-0 flex-col py-2.5">
      <div className="mb-1.5 px-3.5 text-[10px] font-medium tracking-[0.06em] text-[#9c9ca8]">
        导航
      </div>
      <nav className="flex flex-1 flex-col gap-[2px] px-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS]
          const selected = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              data-active={selected}
              onClick={() => onChange(item.id)}
              className={`nav-item flex items-center gap-2 rounded-[7px] px-2.5 py-[7px] text-left text-[12.5px] tracking-tight ${
                selected
                  ? 'font-medium text-[#1a1a1c]'
                  : 'font-normal text-[#5c5c66] hover:bg-white/50 hover:text-[#1a1a1c]'
              }`}
            >
              <Icon
                className={`h-[15px] w-[15px] shrink-0 ${selected ? 'text-[#2f6fed]' : 'text-[#9c9ca8]'}`}
                strokeWidth={selected ? 2.1 : 1.75}
              />
              <span className="truncate leading-none">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="mt-auto px-3.5 pt-2 text-[10.5px] tracking-tight text-[#b0b0ba]">
        Demo · MIT
      </div>
    </aside>
  )
}
