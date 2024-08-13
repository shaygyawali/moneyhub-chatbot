import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "Welcome to MoneyHub, where your financial future begins! MoneyHub is an interactive platform designed to help you master the essential principles of personal finance through engaging, collaborative games and real-world activities. Here, you'll dive into the exciting world of income management, credit building, investing strategies, and budgeting techniques—all while competing and collaborating with peers. \n \nOur goal is to make learning about finance fun and impactful. Through our dynamic gaming experiences, you'll gain practical skills, make informed financial decisions, and set yourself up for long-term success. Whether you're strategizing in a group challenge, completing individual tasks, or participating in live events, MoneyHub will inspire you to take control of your financial journey.\n\nAre you ready to level up your financial literacy? Let’s get started and turn financial knowledge into real-life success!" // Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: "gpt-3.5-turbo" // Specify the model to use
    ,stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}