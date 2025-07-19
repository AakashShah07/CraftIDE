import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    // Imagine this is download step
    await step.sleep("wait-a-moment", "10s");

    // Imagine this is a transcript step
    await step.sleep("wait-a-moment", "4s");

// Imagine this is summery
    await step.sleep("wait-a-moment", "4s");


    return { message: `Hello ${event.data.email}!` };
  },
);