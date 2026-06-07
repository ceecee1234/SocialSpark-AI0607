"use client"

import { create } from "zustand"
import type { PlatformId, ToneId } from "@/lib/platforms"

export type GeneratedContent = {
  title: string
  body: string
  hashtags: string[]
}

type AppState = {
  idea: string
  platform: PlatformId
  tone: ToneId
  loading: boolean
  streaming: boolean
  content: GeneratedContent | null
  rawStream: string
  error: string | null

  setIdea: (v: string) => void
  setPlatform: (v: PlatformId) => void
  setTone: (v: ToneId) => void
  generate: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  idea: "",
  platform: "xiaohongshu",
  tone: "emotional",
  loading: false,
  streaming: false,
  content: null,
  rawStream: "",
  error: null,

  setIdea: (v) => set({ idea: v }),
  setPlatform: (v) => set({ platform: v }),
  setTone: (v) => set({ tone: v }),

  generate: async () => {
    const { idea, platform, tone } = get()
    if (!idea.trim()) return

    set({ loading: true, streaming: true, rawStream: "", content: null, error: null })

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, platform, tone }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "请求失败" }))
        set({ error: err.error ?? "请求失败", loading: false, streaming: false })
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No stream")

      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        set({ rawStream: accumulated })
      }

      // Parse the final accumulated JSON
      const parsed = parseContent(accumulated)
      set({ content: parsed, loading: false, streaming: false })
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "生成失败，请重试",
        loading: false,
        streaming: false,
      })
    }
  },
}))

function parseContent(raw: string): GeneratedContent {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      title: parsed.title ?? "",
      body: parsed.body ?? "",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
    }
  } catch {
    // Fallback: treat entire output as body
    return { title: "", body: raw, hashtags: [] }
  }
}
