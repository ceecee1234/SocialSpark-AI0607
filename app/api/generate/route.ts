import { NextRequest } from "next/server"
import OpenAI from "openai"

export const runtime = "edge"

const SYSTEM_PROMPTS: Record<string, string> = {
  xiaohongshu: `你是一个小红书爆款文案专家。请生成一篇小红书帖子，必须：
- 包含吸睛标题（带Emoji）
- 正文大量使用Emoji，段落间用换行分隔
- 字数约300字
- 结尾附上5个流行标签（以#开头）
请以JSON格式返回：{"title":"...","body":"...","hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5"]}`,

  twitter: `你是一个推特大V。请生成推文内容，必须：
- 语言犀利、简短，有强烈的病毒传播属性
- 总字符数不超过280字符
- 可包含1-3个英文或中文标签
请以JSON格式返回：{"title":"","body":"...（推文正文）","hashtags":["#tag1"]}`,

  instagram: `你是一个Instagram内容创作者。请生成一篇Instagram配文，必须：
- 开头一句高级感金句
- 正文有质感、有故事感，带Emoji
- 结尾附上8-10个英文+中文标签，提升曝光
请以JSON格式返回：{"title":"...","body":"...","hashtags":["#tag1","#tag2",...]}`,

  wechat: `你是一个公众号内容运营专家。请生成一篇公众号文章，必须：
- 包含吸引点击的标题
- 结构化正文：开头钩子 + 正文3-4段 + 结尾行动召唤
- 语言有温度，字数500字左右
请以JSON格式返回：{"title":"...","body":"...","hashtags":[]}`,
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

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "未配置 OpenAI API Key" }), { status: 500 })
  }

  const client = new OpenAI({ apiKey })

  const systemPrompt = SYSTEM_PROMPTS[platform] ?? SYSTEM_PROMPTS.xiaohongshu
  const toneHint = TONE_HINTS[tone] ?? ""

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
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
