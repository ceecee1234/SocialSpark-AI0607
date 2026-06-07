"use client"

import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Wand2, Check, Loader2, AlertCircle } from "lucide-react"
import { platforms, tones } from "@/lib/platforms"
import { useAppStore } from "@/lib/store"

export function CreationPanel() {
  const { idea, setIdea, platform, setPlatform, tone, setTone, loading, error, generate } = useAppStore()

  return (
    <div className="flex flex-col gap-7">
      {/* Section A: Idea Input */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">说说你的灵感</h2>
          <span className="text-xs text-slate-400">第 1 步 / 共 3 步</span>
        </div>
        <div className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 focus-within:border-indigo-300 focus-within:shadow-md">
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="今天想发点什么？（例如：一家新开咖啡馆的探店测评，环境很安静，拿铁很丝滑……）"
            className="min-h-36 resize-none rounded-2xl border-0 bg-transparent p-4 pb-14 text-[15px] leading-relaxed text-slate-700 shadow-none focus-visible:ring-0"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="absolute bottom-3 right-3 gap-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
          >
            <Wand2 className="size-3.5" />
            AI 优化提示词
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}
      </section>

      {/* Section B: Platform Selector */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">选择发布平台</h2>
        <div className="grid grid-cols-2 gap-3">
          {platforms.map((p) => {
            const active = platform === p.id
            const Icon = p.icon
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition-all duration-300 hover:shadow-md",
                  active
                    ? cn("border-transparent ring-2", p.ring, p.glow)
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <span className={cn("flex size-10 items-center justify-center rounded-lg", p.bg, p.accent)}>
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">{p.name}</span>
                  <span className="block truncate text-xs text-slate-400">{p.hint}</span>
                </span>
                {active && (
                  <span className={cn("absolute right-2 top-2 flex size-4 items-center justify-center rounded-full", p.accent)}>
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Section C: Tone Selector */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">设定内容语气</h2>
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => {
            const active = tone === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                  active
                    ? "border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_6px_18px_-6px_rgba(99,102,241,0.6)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Action Button */}
      <Button
        type="button"
        onClick={generate}
        disabled={loading || !idea.trim()}
        className="group h-14 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-base font-semibold text-white shadow-[0_12px_40px_-10px_rgba(124,58,237,0.65)] transition-all duration-300 hover:shadow-[0_16px_48px_-8px_rgba(124,58,237,0.8)] hover:brightness-105 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            正在生成魔法…
          </>
        ) : (
          <>
            <Sparkles className="size-5 transition-transform duration-300 group-hover:rotate-12" />
            生成魔法 ✨
          </>
        )}
      </Button>
    </div>
  )
}
