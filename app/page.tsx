"use client"

import { useAppStore } from "@/lib/store"
import { TopNav } from "@/components/top-nav"
import { CreationPanel } from "@/components/creation-panel"
import { PreviewPanel } from "@/components/preview-panel"

export default function Page() {
  const platform = useAppStore((s) => s.platform)

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Glowing orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-[28rem] rounded-full bg-purple-300/40 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-40 size-[26rem] rounded-full bg-blue-300/40 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-[22rem] rounded-full bg-indigo-200/40 blur-[120px]" />

      <div className="relative z-10">
        <TopNav />

        <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              一句话，生成爆款社媒内容 ✨
            </h1>
            <p className="text-pretty text-sm text-slate-500">
              新手友好的 AI 创作工作台，输入灵感即可生成适配各平台风格的图文。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]">
            {/* Left: Creation Engine */}
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:p-6">
              <CreationPanel />
            </div>

            {/* Right: Live Preview */}
            <div className="rounded-3xl border border-white/60 bg-slate-100/70 p-5 shadow-sm backdrop-blur-xl md:p-6">
              <PreviewPanel platform={platform} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
