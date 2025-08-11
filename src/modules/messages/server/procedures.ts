import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({

    getMany: baseProcedure
       .query(async () =>{
        const msgs = await prisma.message.findMany({
            orderBy: {
                updatedAt: 'desc'  // Descending Order of request
            },
            // include:{
            //     fragment: true
            // }
        });
        return msgs;
       }),

    create: baseProcedure
       .input(
        z.object({
            value: z.string().min(1, {message: "Message is required"})
        })
       )

       .mutation(async ({input}) =>{

            const createMsg =  await prisma.message.create({
                data:{
                    content: input.value,
                    role:"USER",
                    type:"RESULT"
                }
            });

             await inngest.send({
                    name:"craft-agent/run",
                    data :{
                        value:input.value
                    }
                }) ;

                return createMsg;


       })

})





