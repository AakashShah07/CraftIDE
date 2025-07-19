import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

const Page = async () => {
  const quearyClient = getQueryClient();
  void quearyClient.prefetchQuery(
    trpc.createAI.queryOptions({ text: "Aakash Prefetch" })
  );

  return (
    <HydrationBoundary state={dehydrate(quearyClient)}>
      <Suspense fallback={<p>Loading......</p>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
