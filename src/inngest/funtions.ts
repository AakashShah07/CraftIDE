// inngest/functions.ts
import { inngest } from "./client";
import { createAgent } from "@/lib/deepseek";
import {Sandbox} from "@e2b/code-interpreter"
import { getSandbox } from "./util";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    try {

      const sandboxID = await step.run("get-sandbox-id", async()=>{
        const sandbox = await Sandbox.create("crafideeee-nextjs-new2-2");
        return sandbox.sandboxId;
      })

      const input = event.data.value || "Hello world";

      const agent = createAgent();
      const response = await agent.ask(`Write the following snippet: ${input}`);

      console.log("Agent Response:", response);

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxID);
        const host = sandbox.getHost(3000);
        return `http://${host}`;
      })

      return {
        success: "ok",
        message: response,sandboxUrl: sandboxUrl,

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
