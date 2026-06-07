"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toast, useToast } from "@/components/ui/toast"
import { Image as ImageIcon, Heart, MessageCircle, Bookmark, Share2, Copy, Download, RefreshCw } from "lucide-react"
import { platforms, type PlatformId } from "@/lib/platforms"
import { useAppStore } from "@/lib/store"

type Props = {
  platform: PlatformId
}

export function PreviewPanel({ platform }: Props) {
  const meta = platforms.find((p) => p.id === platform)!
  const { content, rawStream, streaming, loading, generate } = useAppStore()
  const { visible, message, show } = useToast()

  const [displayedTitle, setDisplayedTitle] = useState("")
  const [displayedBody, setDisplayedBody] = useState("")
  const prevRawRef = useRef("")

  useEffect(() => {
    if (!streaming) {
      if (content) {
        setDisplayedTitle(content.title)
        setDisplayedBody(content.body)
      }
      prevRawRef.current = ""
      return
    }

    if (rawStream === prevRawRef.current) return
    prevRawRef.current = rawStream

    const titleMatch = rawStream.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"?/)
    if (titleMatch) {
      setDisplayedTitle(
        titleMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"')
      )
    }

    const bodyMatch = rawStream.match(/"body"\s*:\s*"((?:[^"\\]|\\.)*)"?/)
    if (bodyMatch) {
      setDisplayedBody(
        bodyMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\$/, "")
      )
    }
  }, [rawStream, streaming, content])

  useEffect(() => {
    if (loading && !streaming) {
      setDisplayedTitle("")
      setDisplayedBody("")
    }
  }, [loading, streaming])

  const handleCopy = async () => {
    const lines = [
      displayedTitle,
      "",
      displayedBody,
      "",
      ...(content?.hashtags ?? []),
    ]
    const text = lines.join("\n").trim()
    try {
      await navigator.clipboard.writeText(text)
      show("复制成功，去发布吧！")
    } catch {
      show("复制失败，请手动选择文本")
    }
  }

  const hashtags = content?.hashtags ?? []
  const hasContent = !!(displayedTitle || displayedBody)

  return (
    <>
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
              loading && "opacity-70",
            )}
          >
            <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
              <div className="h-full overflow-y-auto">
                {/* Image placeholder */}
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
                <div className="space-y-3 p-4 pb-16">
                  {hasContent ? (
                    <>
                      {displayedTitle && (
                        <h3 className="text-pretty text-base font-bold leading-snug text-slate-900">
                          {displayedTitle}
                          {streaming && (
                            <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-slate-500" />
                          )}
                        </h3>
                      )}
                      {displayedBody && (
                        <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
                          {displayedBody}
                          {streaming && !displayedTitle && (
                            <span className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-slate-500" />
                          )}
                        </p>
                      )}
                      {hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1 pt-1">
                          {hashtags.map((tag) => (
                            <span key={tag} className="text-[13px] font-medium text-indigo-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <span className="text-3xl">✨</span>
                      <p className="mt-2 text-xs text-slate-400">在左侧输入灵感，点击生成</p>
                    </div>
                  )}
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

        {/* Action buttons */}
        <div className="flex w-full max-w-sm items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!hasContent || streaming}
            className="flex-1 gap-1.5 rounded-full border-slate-200 bg-white/80 text-slate-700 backdrop-blur hover:bg-white disabled:opacity-40"
          >
            <Copy className="size-4" />
            复制文案
          </Button>
          <Button
            variant="outline"
            disabled
            className="flex-1 gap-1.5 rounded-full border-slate-200 bg-white/80 text-slate-700 backdrop-blur hover:bg-white disabled:opacity-40"
          >
            <Download className="size-4" />
            下载图片
          </Button>
          <Button
            variant="outline"
            onClick={generate}
            disabled={loading}
            className="flex-1 gap-1.5 rounded-full border-slate-200 bg-white/80 text-slate-700 backdrop-blur hover:bg-white disabled:opacity-40"
          >
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            重新生成
          </Button>
        </div>
      </div>

      <Toast message={message} visible={visible} />
    </>
  )
}
