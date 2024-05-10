import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { Status } from "@prisma/client";

export const orderRouter = createTRPCRouter({
  // DEBUG getOrders: there is an issue w/ synchronization. role isn't included in user within ctx, which is why their needed to be an input (a messier, worse solution)
  getOrders: protectedProcedure
    .input(z.object({
      role: z.number()
    }))
    .query(async ({ ctx, input }) => {
        return await ctx.db.order.findMany({
          where: {
            ...(input.role === 0 ? { userId: ctx.session?.user.id } : {}),
          },
          include: {
            comments: {
              include: {
                user: true,
              },
            },
            user: true,
          },
        });
      }),
    createOrder: protectedProcedure
    .input(z.object({
        userId: z.string(),
        status: z.nativeEnum(Status),  // need to make status enum defined in order
        categories: z.string(),
        description: z.string(),
        details: z.string(),  // json?
    }))
    .mutation(async ({ ctx, input }) => {
        const { userId, status, categories, description, details } = input;

        const newOrder = await ctx.db.order.create({
            data: {
                user: { connect: { id: userId } },
                status,
                categories,
                description,
                details
            }
        });

        return newOrder;
    }),
})