// inngest/functions.ts
import { inngest } from "./client";
import { createAgent } from "@/lib/deepseek";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    try {
      const input = event.data.value || "Hello world";

      const agent = createAgent();
      const response = await agent.ask(`Write the following snippet: ${input}`);

      console.log("Agent Response:", response);

      return {
        success: "ok",
        message: response,
      };
    } catch (error) {
      console.error("Error in helloWorld function:", error);
      return {
        success: "error",
        message: "Failed to get response from DeepSeek",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);
