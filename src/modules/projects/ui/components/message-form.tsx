import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextaresAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

const MessageForm = ({ projectId }: Props) => {

   

    const trpc = useTRPC();
    const queryClient =  useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({

        resolver:zodResolver(formSchema),
        defaultValues:{
            value: "",
        }
    });

    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess:() =>{
            form.reset();
            queryClient.invalidateQueries(
                trpc.messages.getMany.queryOptions({projectId})
            );
            // TODO: Invalidate usage status
        },
        onError:(error) =>{
            toast.error(error.message || "Something went wrong");
        }
    }));

    const onSubmit  = async(values: z.infer<typeof formSchema>) =>{
        console.log(values);
        await createMessage.mutateAsync({
            value: values.value,
            projectId
        })
    }
    const [isFocused,setIsFocused] = useState(false); 
    const showUsage = false ;

    const isPending =  createMessage.isPending;
    const isDisabled = isPending || !form.formState.isValid;

  return (

        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
                "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                isFocused && "shadow-xs",
                showUsage && "rounded-t-none",
            )}
            >
                    <FormField
                    control={form.control}
                    name="value"
                    render={({field}) => (
                        <TextaresAutosize
                            {...field}
                            disabled={isPending}
                            onFocus={()=>setIsFocused(true)}
                            onBlur={()=> setIsFocused(false)}
                            minRows={2}
                            // maxLength={8}
                            className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                            placeholder="What would you like to build ?"
                            onKeyDown={(e) =>{
                               if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                                { e.preventDefault();
                                form.handleSubmit(onSubmit)(e);}
                            }}
                        />
                    )}
                    />
                    <div className="flex gap-x-2 items-end justify-between pt-2">
                        <div className="text-[10px] text-muted-foreground font-mono">
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium">
                                    <span>&#8984;</span>Enter
                                </kbd>
                                &nbsp;to submit
                        </div>
                            <Button
                            disabled={isDisabled}
                            className={cn(
                                "size-8 rounded-full",
                                isDisabled && "bg-muted-foreground border"

                            )}
                            >
                                {isPending ? (
                                    <Loader2Icon className="size-4 animate-spin"/>
                                ):(
                                    <ArrowUpIcon/>
                                )}
                                
                            </Button>
                    </div>
            </form>
        </Form>

  );
};

export default MessageForm;
