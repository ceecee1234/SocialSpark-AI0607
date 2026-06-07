"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ImageIcon, Heart, MessageCircle, Bookmark, Share2, Copy, Download, RefreshCw } from "lucide-react"
import { platforms, type PlatformId } from "@/lib/platforms"

export type GeneratedContent = {
  title: string
  body: string
  hashtags: string[]
}

type Props = {
  platform: PlatformId
  content: GeneratedContent
  loading: boolean
}

export function PreviewPanel({ platform, content, loading }: Props) {
  const meta = platforms.find((p) => p.id === platform)!

  return (
    <div className="flex h-full flex-col items-center justify-between gap-8 py-2">
      <div className="flex items-center gap-2 self-start">
        <span className={cn("flex size-7 items-center justify-center rounded-md", meta.bg, meta.accent)}>
          <meta.icon className="size-4" />
        </span>
        <span className="text-sm font-medium text-slate-500">
          {meta.name} · 实时预览
        </span>
      </div>

      {/* Phone Mockup */}
      <div className="relative">
        <div
          className={cn(
            "relative h-[620px] w-[300px] rounded-[3rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl transition-all duration-500",
            loading && "opacity-60",
          )}
        >
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
            <div className="h-full overflow-y-auto">
              {/* Image carousel placeholder 3:4 */}
              <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <ImageIcon className="size-10" />
                  <span className="text-xs">图片占位 · 3:4</span>
                </div>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={cn("h-1.5 rounded-full bg-white/90", i === 0 ? "w-4" : "w-1.5 bg-white/50")}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 p-4">
                <h3 className="text-pretty text-base font-bold leading-snug text-slate-900">
                  {content.title}
                </h3>
                <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
                  {content.body}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 pt-1">
                  {content.hashtags.map((tag) => (
                    <span key={tag} className="text-[13px] font-medium text-indigo-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1 text-xs">
                  <Heart className="size-4 text-rose-400" /> 2.3k
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle className="size-4" /> 128
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Bookmark className="size-4" /> 891
                </span>
              </div>
              <Share2 className="size-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons outside frame */}
      <div className="flex w-full max-w-sm items-center justify-center gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-1.5 rounded-full border-slate-200 bg-white/80 text-slate-700 backdrop-blur hover:bg-white"
        >
          <Copy className="size-4" />
          复制文案
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-1.5 rounded-full border-slate-200 bg-white/80 text-slate-700 backdrop-blur hover:bg-white"
        >
          <Download className="size-4" />
          下载图片
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-1.5 rounded-full border-slate-200 bg-white/80 text-slate-700 backdrop-blur hover:bg-white"
        >
          <RefreshCw className="size-4" />
          重新生成
        </Button>
      </div>
    </div>
  )
}
