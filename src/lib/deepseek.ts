// lib/deepseek.ts
export const callDeepSeek = async (input: string) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Inngest Summarizer",
    },
    body: JSON.stringify({
      // model: "deepseek/deepseek-r1-0528:free",
      // model: "qwen/qwq-32b:free",
      "model": "deepseek/deepseek-chat-v3-0324:free",

      messages: [
        {
          role: "user",
          content: `You are a expert nextJs developer, You write readable, maintainable code. You write simple Next.js & React snippets. ${input}`,
        },
      ],
    }),
  });

  const json = await res.json();
  console.log("DeepSeek Response:", json);
  return json?.choices?.[0]?.message?.content ?? "No response from DeepSeek";
};

// Agent wrapper
export const createAgent = () => {
  return {
    ask: async (prompt: string) => {
      return await callDeepSeek(prompt);
    },
  };
};
