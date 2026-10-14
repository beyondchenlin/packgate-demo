import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ToastItem = { id: number; message: string }

type ToastCtx = { toast: (message: string) => void }

const Ctx = createContext<ToastCtx | null>(null)

let seq = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string) => {
    const id = ++seq
    setItems((prev) => [...prev.slice(-3), { id, message }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 2400)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-7 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-1.5">
        {items.map((t) => (
          <div
            key={t.id}
            className="toast-enter rounded-[8px] bg-[#1a1a1c]/92 px-3.5 py-2 text-[12px] tracking-tight text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm"
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast outside provider')
  return ctx
}
