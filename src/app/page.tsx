"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {toast} from "sonner";
import { set } from "zod";

const Page =  () => {

  const [value, setValue] = useState("");
 
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job invoked successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to invoke background job: ${error.message}`);
    },
  }));

  return (

    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e)=> setValue(e.target.value)}/>
      <Button disabled={invoke.isPending} onClick={()=> invoke.mutate({value: value})}>
        Invoke Background Job
      </Button>
    </div>

  );
};

export default Page;
