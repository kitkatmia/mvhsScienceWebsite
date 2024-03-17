import { createTRPCRouter, publicProcedure } from "../trpc";

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
    })
})