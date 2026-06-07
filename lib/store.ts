"use client"

import { create } from "zustand"
import type { PlatformId, ToneId } from "@/lib/platforms"

type AppState = {
  idea: string
  platform: PlatformId
  tone: ToneId
  loading: boolean
  streaming: boolean
  streamText: string
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
  streamText: "",
  error: null,

  setIdea: (v) => set({ idea: v }),
  setPlatform: (v) => set({ platform: v }),
  setTone: (v) => set({ tone: v }),

  generate: async () => {
    const { idea, platform, tone } = get()
    if (!idea.trim()) return

    set({ loading: true, streaming: true, streamText: "", error: null })

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

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        set((s) => ({ streamText: s.streamText + chunk }))
      }

      set({ loading: false, streaming: false })
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "生成失败，请重试",
        loading: false,
        streaming: false,
      })
    }
  },
}))
