import { z } from "zod";
import { createTool } from "@inngest/agent-kit";
import { getSandbox } from "@/inngest/util";

export const createTerminalTool = (sandboxID: string) => {
  return createTool({
    name: "terminal",
    description: "Run terminal commands",
    parameters: z.object({
      command: z.string().describe("The command to run in the terminal"),
    }),
    handler: async ({ command }, { step }) => {
      if (!step) return { error: "This tool requires step context" };

      return await step.run("terminal", async () => {
        const buffers = { stdout: "", stderr: "" };

        try {
          const sandbox = await getSandbox(sandboxID);
          const result = await sandbox.commands.run(command, {
            onStdout: (data) => {buffers.stdout += data},
            onStderr: (data) => {buffers.stderr += data},
          });

          return {
            success: true,
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.exitCode,
          };
        } catch (error) {
          console.error(`Command failed: ${error}`);
          return `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}` ;
        }
      });
    },
  });
};
