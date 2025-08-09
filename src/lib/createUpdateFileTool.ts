import { z } from "zod";
import { createTool } from "@inngest/agent-kit";
import { getSandbox } from "@/inngest/util";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { mkdirSync } from "fs";

export const createOrUpdateFile = (sandboxID: string) => {
  return createTool({
    name: "createOrUpdateFile",
    description: "Create or update a file with the given content",
    parameters: z.object({
      files: z.array(
        z.object({
          path: z.string().describe("The path to the file to create or update"),
          content: z.string().describe("The content to write to the file"),
        })
      ),
    }),
    handler: async ({ files }, { step, ctx }) => {
        console.log("[createOrUpdateFile] Tool triggered with files:", files);

      if (!step) {
        return { error: "This tool requires step context" };
      }

      const newfiles  =  await step.run("create-or-update-file", async () => {
        try {
          // Ensure the directory exists
         const results = [];
        const sandbox  = await getSandbox(sandboxID);
        
        for (const file of files) {
            console.log(`[createOrUpdateFile] Writing file: ${file.path}`);

          // Ensure the directory exists
        //   const dir = dirname(file.path);
        //   mkdirSync(dir, { recursive: true });
          
          // Write the file
          await sandbox.files.write(file.path, file.content);
          results.push(file.path);
        }

         
        return {
          success: true,
          message: `Files created/updated successfully: ${results.join(", ")}`,
          filesCreated: results.length,
          paths: results
        };
          

          
        } catch (error) {
          console.error(`Error writing file to sandbox, createUpdateFile tool error`, error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      });
       if (typeof newfiles === "object" && newfiles?.success && ctx?.network?.state?.data) {
        ctx.network.state.data.files = newfiles;
      }
      return newfiles;

    },
  });
};
