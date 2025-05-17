import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), ownerId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          ownerId: input.ownerId,
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth?.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view posts",
      });
    }

    const post = await ctx.db.post.findFirst({
      where: {
        ownerId: userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),
});
