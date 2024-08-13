import { NextResponse } from 'next/server'; 
import OpenAI from 'openai'; 

const systemPrompt = `Welcome to MoneyHub, where your financial future begins! MoneyHub is an interactive platform designed to help you master the essential principles of personal finance through engaging, collaborative games and real-world activities. Here, you'll dive into the exciting world of income management, credit building, investing strategies, and budgeting techniques—all while competing and collaborating with peers.\n\nOur goal is to make learning about finance fun and impactful. Through our dynamic gaming experiences, you'll gain practical skills, make informed financial decisions, and set yourself up for long-term success. Whether you're strategizing in a group challenge, completing individual tasks, or participating in live events, MoneyHub will inspire you to take control of your financial journey.\n\nAre you ready to level up your financial literacy? Let’s get started and turn financial knowledge into real-life success!`;

export async function POST(req) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); 
  const data = await req.json(); 

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data], 
    model: "gpt-3.5-turbo", 
    stream: true, 
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); 
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; 
          if (content) {
            const text = encoder.encode(content); 
            controller.enqueue(text); 
          }
        }
      } catch (err) {
        controller.error(err); 
      } finally {
        controller.close(); 
      }
    },
  });

  return new NextResponse(stream); 
}
