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
import { prisma } from "@/lib/db";


export const craftAgent = inngest.createFunction(
  { id: "craft-agent" },
  { event: "craft-agent/run" },
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

      async function saveResultToSandbox(sandbox, files) {
  // Preprocess & normalize paths
  const processedFiles = files.map(file => ({
    path: file.path.replace(/^\/*/, ""), // strip leading slashes
    content: file.content
  }));

  // If your sandbox API supports batch writes
  if (sandbox.files?.writeAll) {
    await sandbox.files.writeAll(processedFiles);
  } else {
    // Parallel writes to speed up
    await Promise.all(
      processedFiles.map(f => sandbox.files.write(f.path, f.content))
    );
  }
}


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
        

      const response = await codeAgent.ask(`Write the following snippet: ${input}`);

      console.log("Agent Response:", response);

      const updates = parseFileUpdatesFromResponse(response);

      if (updates && updates.length > 0) {
  try {
    const sandbox = await getSandbox(sandboxID);
    const written: string[] = [];
    saveResultToSandbox(sandbox, updates);
    

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

      

      const messageContent =  ( !response && lastAssistenttextMessageContent(response)) ||
        (typeof response === "string"
          ? response
          : JSON.stringify(response || { error: "Something went wrong. Please try again" }));



      await step.run("save-result", async ()=>{
        return await prisma.message.create({
          data:{
            projectId: event.data.projectId,
            content: messageContent,
            role:"ASSISTANT",
            type:!response ? "ERROR":"RESULT",
            fragment: {
              create: {
                sandboxUrl: sandboxUrl || "",
                title:"Fragment",
                files: updates || []
              }
            }
          }
        })
      })

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
