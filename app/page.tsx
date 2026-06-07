"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { CreationPanel } from "@/components/creation-panel"
import { PreviewPanel, type GeneratedContent } from "@/components/preview-panel"
import type { PlatformId, ToneId } from "@/lib/platforms"

const defaultContent: GeneratedContent = {
  title: "城市角落里的宝藏咖啡馆☕️ 一秒治愈打工人",
  body: "📍藏在巷子深处的安静小店，推门进去整个世界都慢了下来\n\n🪑原木桌椅 + 暖光氛围，随手一拍就是大片\n☕️招牌丝绒拿铁，奶泡绵密、回甘明显，真的会上头\n🎧背景音乐刚刚好，适合一个人发呆或敲电脑\n\n人均不到 40，性价比超高，强烈安利给同样需要喘口气的你！",
  hashtags: ["#探店日记", "#咖啡馆", "#城市治愈", "#打工人快乐", "#周末去哪儿"],
}

export default function Page() {
  const [idea, setIdea] = useState("")
  const [platform, setPlatform] = useState<PlatformId>("xiaohongshu")
  const [tone, setTone] = useState<ToneId>("emotional")
  const [loading, setLoading] = useState(false)
  const [content] = useState<GeneratedContent>(defaultContent)

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1600)
  }

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
              <CreationPanel
                idea={idea}
                setIdea={setIdea}
                platform={platform}
                setPlatform={setPlatform}
                tone={tone}
                setTone={setTone}
                loading={loading}
                onGenerate={handleGenerate}
              />
            </div>

            {/* Right: Live Preview */}
            <div className="rounded-3xl border border-white/60 bg-slate-100/70 p-5 shadow-sm backdrop-blur-xl md:p-6">
              <PreviewPanel platform={platform} content={content} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
