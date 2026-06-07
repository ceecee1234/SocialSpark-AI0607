import { BookHeart, MessageSquareText, Camera, Newspaper, type LucideIcon } from "lucide-react"

export type PlatformId = "xiaohongshu" | "twitter" | "instagram" | "wechat"

export type Platform = {
  id: PlatformId
  name: string
  hint: string
  icon: LucideIcon
  // tailwind tokens
  accent: string // text/icon color
  bg: string // soft chip background
  ring: string // active ring color
  glow: string // active glow shadow
}

export const platforms: Platform[] = [
  {
    id: "xiaohongshu",
    name: "小红书",
    hint: "Emoji + 清单种草",
    icon: BookHeart,
    accent: "text-rose-500",
    bg: "bg-rose-50",
    ring: "ring-rose-400",
    glow: "shadow-[0_8px_30px_-8px_rgba(244,63,94,0.45)]",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    hint: "精炼推文串",
    icon: MessageSquareText,
    accent: "text-slate-900",
    bg: "bg-slate-100",
    ring: "ring-slate-800",
    glow: "shadow-[0_8px_30px_-8px_rgba(15,23,42,0.45)]",
  },
  {
    id: "instagram",
    name: "Instagram",
    hint: "高级感配文 + 标签",
    icon: Camera,
    accent: "text-fuchsia-500",
    bg: "bg-fuchsia-50",
    ring: "ring-fuchsia-400",
    glow: "shadow-[0_8px_30px_-8px_rgba(217,70,239,0.45)]",
  },
  {
    id: "wechat",
    name: "公众号文章",
    hint: "结构化长文",
    icon: Newspaper,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-500",
    glow: "shadow-[0_8px_30px_-8px_rgba(16,185,129,0.45)]",
  },
]

export type ToneId = "professional" | "humorous" | "emotional" | "storytelling"

export const tones: { id: ToneId; label: string }[] = [
  { id: "professional", label: "专业严谨" },
  { id: "humorous", label: "幽默风趣" },
  { id: "emotional", label: "情感共鸣" },
  { id: "storytelling", label: "故事叙述" },
]
