"use client";
// 
import { useTRPC } from "@/trpc/client"

const Page = () => {
  
  const trpc = useTRPC();
  trpc.createAI.queryOptions({ text: "world" });

  return (
    <div >
      Hello world
    </div>
  )
}

export default Page
