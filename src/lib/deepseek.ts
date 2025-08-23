import { PROMPT } from "@/prompt";
import { AgentResult } from "@inngest/agent-kit";

// lib/deepseek.ts
export const callDeepSeek = async (input: string) => {
  console.log("Going to call the api")
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Expert coding agent",
    },
    body: JSON.stringify({
      // model: "deepseek/deepseek-r1-0528:free",
      // model: "qwen/qwq-32b:free",
      "model": "deepseek/deepseek-chat-v3-0324:free",

      messages: [
        {
          role: "user",
          content: `${PROMPT} ${input}`,
        },
      ],
    }),
  });
  // console.log("Going to call the api")

  const json = await res.json();
  console.log("DeepSeek Response:", json);
  return json?.choices?.[0]?.message?.content ?? "No response from DeepSeek";
};

// Agent wrapper
export const createAgent = (tools= [], lifecycle = {}) => {
  return {
   ask: async (prompt: string) => {
      const result = await callDeepSeek(prompt);
      
      // Create a mock result object that matches AgentResult structure
      const mockResult: AgentResult = {
        output: [
          {
            role: "assistant",
            content: result,
            type: "text"
          }
        ]
      };
      
      // Call lifecycle onFinish if provided
      if (lifecycle.onFinish) {
        await lifecycle.onFinish({ result: mockResult });
      }
      
      return mockResult;
    },
    tools,
    lifecycle
  };
};