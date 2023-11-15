import { initEdgeStore } from "@edgestore/server";
import {
  createEdgeStoreNextHandler,
  CreateContextOptions,
} from "@edgestore/server/adapters/next/app";
import { auth } from "@clerk/nextjs";
import * as z from "zod";

type Context = {
  userId: string;
};

async function createContext(options: CreateContextOptions): Promise<Context> {
  const { userId } = auth();

  return {
    userId: userId!,
  };
}

const es = initEdgeStore.context<Context>().create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  privateFiles: es
    .fileBucket({
      accept: ["image/jpeg", "image/png"],
    })
    .input(
      z.object({
        category: z.string(),
      })
    )
    .path(({ ctx, input }) => [
      { category: input.category },
      { author: ctx.userId },
    ])
    .accessControl({
      userId: { path: "author" },
    })
    .beforeUpload(() => {
      return true;
    })
    .beforeDelete(() => {
      return true;
    }),
  publicFiles: es
    .fileBucket({
      accept: ["image/jpeg", "image/png"],
    })
    .input(
      z.object({
        category: z.string(),
      })
    )
    .path(({ ctx, input }) => [
      { category: input.category },
      { author: ctx.userId },
    ])
    .beforeUpload(() => {
      return true;
    })
    .beforeDelete(() => {
      return true;
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
