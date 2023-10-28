import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
//   hello: publicProcedure
//     .input(z.object({ text: z.string() }))
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input.text}`,
//       };
//     }),

//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.db.example.findMany();
//   }),

  getProfileInstructions: protectedProcedure.query(() => {
    return "Please enter further profile details to continue";
  }),
});
