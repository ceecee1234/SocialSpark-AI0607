import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_6px_20px_-6px_rgba(99,102,241,0.7)]">
            <Sparkles className="size-5" />
          </span>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            SocialSpark AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700 hover:bg-amber-50"
          >
            <Sparkles className="size-3.5" />
            剩余额度 15
          </Badge>
          <Avatar className="size-9 ring-2 ring-white">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-medium text-white">
              YL
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
