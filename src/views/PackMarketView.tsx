import { useState } from 'react'
import { Download, Check, Flame, Video, Mic, AudioLines, Globe, Film, Captions } from 'lucide-react'
import { useToast } from '../lib/toast'

type Pack = {
  id: string
  name: string
  desc: string
  size: string
  hot: boolean
  installed: boolean
  icon: 'video' | 'tts' | 'asr' | 'crawl' | 'remotion' | 'align'
}

const INITIAL: Pack[] = [
  {
    id: 'video-mm',
    name: '视频多模态',
    desc: '云端 LLM + 本地 ASR/TTS/分割/剪辑/打包一体包，Agent 选一个入口即可。',
    size: '1.2 GB',
    hot: true,
    installed: false,
    icon: 'video',
  },
  {
    id: 'local-tts',
    name: '本地 TTS',
    desc: '离线文本转语音，长期使用无需在线额度，常见机器可跑。',
    size: '420 MB',
    hot: true,
    installed: true,
    icon: 'tts',
  },
  {
    id: 'local-asr',
    name: '本地 ASR',
    desc: '本地语音识别，适合字幕与口播稿生成。',
    size: '680 MB',
    hot: true,
    installed: false,
    icon: 'asr',
  },
  {
    id: 'reachflow',
    name: 'ReachFlow 爬取',
    desc: '重型爬取 Skill+MCP，安装后后台直接可用。',
    size: '85 MB',
    hot: true,
    installed: false,
    icon: 'crawl',
  },
  {
    id: 'remotion',
    name: 'Remotion 打包',
    desc: '程序化视频渲染与打包，配合剪辑管线输出成片。',
    size: '310 MB',
    hot: false,
    installed: false,
    icon: 'remotion',
  },
  {
    id: 'align',
    name: '字幕对齐',
    desc: '音视频字幕时间轴对齐，与 ASR/TTS 解耦可独立安装。',
    size: '95 MB',
    hot: false,
    installed: false,
    icon: 'align',
  },
]

const ICONS = {
  video: Video,
  tts: Mic,
  asr: AudioLines,
  crawl: Globe,
  remotion: Film,
  align: Captions,
}

export function PackMarketView() {
  const { toast } = useToast()
  const [packs, setPacks] = useState(INITIAL)

  const toggle = (id: string) => {
    setPacks((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = !p.installed
        toast(next ? `已安装 Pack：${p.name}（热加载就绪）` : `已卸载 Pack：${p.name}`)
        return { ...p, installed: next }
      }),
    )
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">Pack 市场</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            重型 Skill + MCP 预制包，按需下载、热加载。大厂已覆盖的轻能力不做，专攻本地难配场景。
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Demo：刷新市场目录')}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] text-slate-600 hover:bg-slate-50"
        >
          刷新
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {packs.map((p) => {
          const Icon = ICONS[p.icon]
          return (
            <div
              key={p.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-[13px] font-semibold text-slate-900">{p.name}</h3>
                    {p.hot && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                        <Flame className="h-3 w-3" />
                        热加载
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{p.desc}</p>
                  <div className="mt-2 text-[11px] text-slate-400">{p.size}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition ${
                    p.installed
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {p.installed ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      已安装
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      安装
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
