"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // ✅ FIXED
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const trpc = useTRPC();

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess:(data) =>{
        // toast.success(`${data.id}`);
        console.log(`${data.id}`)
        router.push(`/projects/${data.id}`)
         toast.success("Background job invoked successfully!");
      },
      onError: (error) => {
        console.log("Error is ", error);
        toast.error(`Failed to invoke background job: ${error.message}`);
      }
      
    })
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value: value })}
        >
          Project
        </Button>
      </div>
    </div>
  );
};

export default Page;
