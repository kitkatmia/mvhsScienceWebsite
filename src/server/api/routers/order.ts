import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { Status } from "@prisma/client";

export const orderRouter = createTRPCRouter( {
    getOrders: publicProcedure
    .query(({ ctx }) => {
        return ctx.db.order.findMany({
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