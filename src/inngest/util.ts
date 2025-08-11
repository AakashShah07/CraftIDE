import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";
import { Content } from "next/font/google";
export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;
    
}

export function lastAssistenttextMessageContent(result: AgentResult) {

    if (!result || !Array.isArray(result.output)) {
    return null; // No valid output
  }


    const lastAssistantTextMsgIndex = result.output.findLastIndex(
        (message) => message.role === "assistant"
    )

    const message = result.output[lastAssistantTextMsgIndex] as 
      | TextMessage
      | undefined ;

    if (lastAssistantTextMsgIndex === -1) return null;


      return message?.content
        ? typeof message.content === "string"
        ?message.content
        : message?.content.map((c) => c.text).join("")
        : undefined;
}