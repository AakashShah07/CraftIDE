// inngest/functions.ts
import { inngest } from "./client";
import { createAgent } from "@/lib/deepseek";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistenttextMessageContent } from "./util";
import { createTerminalTool } from "@/lib/terminalTool";
import { createOrUpdateFile } from "@/lib/createUpdateFileTool";
import { parseFileUpdatesFromResponse } from "@/lib/parseCreateOrUpdateFiles";
import { readFiles } from "@/lib/readFiles";
import { Network } from "inspector/promises";
// import { createNetwork } from "@inngest/agent-kit";

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

      const terminalTool = createTerminalTool(sandboxID);
      const createUpdateFile = createOrUpdateFile(sandboxID);
      const readFile =  readFiles(sandboxID);

      const codeAgent = createAgent([terminalTool,createUpdateFile, readFile ],{

          onFinish: async ({result, network}) =>{
            const lastAsMsgText = lastAssistenttextMessageContent(result);
            if (lastAsMsgText && network)
            {
              if (lastAsMsgText.includes("<task_summary>")){
                network.state.data.summary = lastAsMsgText
              }
            }
          }
          

      });
        // const codeAgent = createAgent();


      const response = await codeAgent.ask(`Write the following snippet: ${input}`);

      console.log("Agent Response:", response);

      const updates = parseFileUpdatesFromResponse(response);

      if (updates && updates.length > 0) {
  try {
    const sandbox = await getSandbox(sandboxID);
    const written: string[] = [];

    for (const file of updates) {
      // Ensure the path is relative and doesn't start with /home/user
      const relPath = file.path.replace(/^\/*/, "");
      console.log("[apply] Writing file:", relPath, " (length:", file.content.length, ")");
      await sandbox.files.write(relPath, file.content);
      written.push(relPath);
    }

    console.log("[apply] Files written:", written);
    // Optionally return that in the function result
  } catch (err) {
    console.error("Error applying file updates to sandbox:", err);
  }
} else {
  console.log("No file updates found in agent response.");
}

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxID);
        const host = sandbox.getHost(3000);
        return `http://${host}`;
      });

      return {
        success: "ok",
        message: response,
        sandboxUrl: sandboxUrl,
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
