import { z } from "zod";
import { createTool } from "@inngest/agent-kit";
import { getSandbox } from "@/inngest/util";

export const readFiles = (sandboxID: string) => {

    return createTool({
  name: "readFile",
  description: "Read the content of one or more files from the sandbox",
  parameters: z.object({
    paths: z.array(z.string()).describe("Array of file paths to read from the sandbox"),
    files: z.array(z.string())
  }),
  handler: async ({  paths }, { step }) => {
    if (!step) {
      return { error: "This tool requires step context" };
    }
    
    return await step.run("read-files", async () => {
      try {
        const sandbox = await getSandbox(sandboxID);
        const results = [];
        
        for (const path of paths) {
          try {
            const content = await sandbox.files.read(path);
            results.push({
              path: path,
              content: content,
              success: true
            });
          } catch (fileError) {
            results.push({
              path: path,
              content: null,
              success: false,
              error: fileError instanceof Error ? fileError.message : "File not found"
            });
          }
        }
        
        return {
          success: true,
          message: `Read ${results.filter(r => r.success).length} of ${paths.length} files successfully`,
          files: results
        };
      } catch (error) {
        console.error("Error reading files from sandbox:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });
  },
});

}