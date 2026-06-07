import { NextRequest } from "next/server"
import OpenAI from "openai"

export const runtime = "edge"

const SYSTEM_PROMPTS: Record<string, string> = {
  xiaohongshu: `你是一个小红书爆款文案专家。请直接输出一篇小红书帖子，必须：
- 第一行是吸睛标题（带Emoji）
- 空一行后是正文，大量使用Emoji，段落间用空行分隔，约300字
- 最后一行是5个流行标签（以#开头，空格分隔）
不要输出任何JSON、代码块或额外说明，直接输出正文内容。`,

  twitter: `你是一个推特大V。请直接输出推文内容，必须：
- 语言犀利、简短，有强烈的病毒传播属性
- 总字符数不超过280字符
- 结尾带1-3个标签
不要输出任何JSON、代码块或额外说明，直接输出推文内容。`,

  instagram: `你是一个Instagram内容创作者。请直接输出Instagram配文，必须：
- 第一行是一句高级感金句
- 空一行后是正文，有质感、有故事感，带Emoji
- 最后附上8-10个英文+中文标签
不要输出任何JSON、代码块或额外说明，直接输出配文内容。`,

  wechat: `你是一个公众号内容运营专家。请直接输出一篇公众号文章，必须：
- 第一行是吸引点击的标题
- 正文结构：开头钩子 + 3-4段正文 + 结尾行动召唤，语言有温度，约500字
不要输出任何JSON、代码块或额外说明，直接输出文章内容。`,
}

const TONE_HINTS: Record<string, string> = {
  professional: "语气：专业严谨，数据说话。",
  humorous: "语气：幽默风趣，妙趣横生，可适当用网络梗。",
  emotional: "语气：情感共鸣，触动人心，有共情力。",
  storytelling: "语气：故事叙述，娓娓道来，有画面感。",
}

export async function POST(req: NextRequest) {
  const { idea, platform, tone } = await req.json()

  if (!idea?.trim()) {
    return new Response(JSON.stringify({ error: "请输入内容灵感" }), { status: 400 })
  }

  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "未配置 NVIDIA API Key" }), { status: 500 })
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
  })

  const systemPrompt = SYSTEM_PROMPTS[platform] ?? SYSTEM_PROMPTS.xiaohongshu
  const toneHint = TONE_HINTS[tone] ?? ""

  const stream = await client.chat.completions.create({
    model: "meta/llama-4-scout-17b-16e-instruct",
    stream: true,
    messages: [
      { role: "system", content: `${systemPrompt}\n\n${toneHint}` },
      { role: "user", content: `内容灵感：${idea}` },
    ],
    temperature: 0.85,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? ""
        if (delta) controller.enqueue(encoder.encode(delta))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}
