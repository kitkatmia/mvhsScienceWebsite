import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { Status } from "@prisma/client";

const statusMap: Record<Status, Status> = {
  [Status.Complete]: Status.Not_Started,
  [Status.Not_Started]: Status.In_Progress,
  [Status.In_Progress]: Status.Complete,
};

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
    addOrderComment: protectedProcedure
      .input(z.object({ comment: z.string(), orderId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const comment = await ctx.db.comment.create({
              data: {
                contents: input.comment,
                user: { connect: { id: ctx.session.user.id } },
                order: { connect: { id: input.orderId } }
              }
        });
        return comment;
      }),
    changeOrderStatus: protectedProcedure
      .input(z.object({ orderId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const order = await ctx.db.order.findUnique({
          where: { id: input.orderId },
          select: { status: true }
        });

        if (!order) {
          throw new Error("Order not found");
        }

        const currentStatus = order.status as Status;
        const nextStatus = statusMap[currentStatus];

        if (nextStatus === undefined) {
          throw new Error("Next status is undefined...");
        } else {
          const updatedOrder = await ctx.db.order.update({
            where: { id: input.orderId },
            data: {
              status: nextStatus 
            }
          });

          return updatedOrder;
        }
      })
})