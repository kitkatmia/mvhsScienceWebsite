import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

const UserProps = z.object({
  name: z.string().optional(),
  school: z.string().optional(),
  subjects: z.array(z.string()),
  rooms: z.array(z.string()),
});

export const userRouter = createTRPCRouter({
  upsertUserAccount: protectedProcedure
    .input(z.object({
      name: z.string(),
      school: z.string().optional(),
      subjects: z.string(),
      rooms: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const userAccount = await ctx.db.$transaction(async (prisma) => {
        // upsert should create / update
        const upsertedUserAccount = await prisma.userAccount.upsert({
          where: { userId: userId },
          create: {
            userId,
            name: input.name,
            school: input.school,
            subjects: input.subjects,
            rooms: input.rooms
          },
          update: {
            name: input.name,
            school: input.school,
            subjects: input.subjects,
            rooms: input.rooms
            // subjects: {
            //   // if update, delete then create new
            //   deleteMany: { userAccountId: userId },
            //   create: input.subjects.map((subject) => ({ name: subject })),
            // },
            // rooms: {
            //   // same as subjects
            //   deleteMany: { userAccountId: userId },
            //   create: input.rooms.map((room) => ({ number: room })),
            // },
          },
          // include: {
          //   subjects: true,
          //   rooms: true,
          // },
        });

        return upsertedUserAccount;
      });

      return userAccount;
    }),
  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.userAccount.findUnique({
      where: { userId: ctx.session.user.id },
      // include: {
      //   subjects: true,
      //   rooms: true,
      // },
    })
    return user;
  }),
  getUserByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.userAccount.findUnique({
        where: { email: input.email },
        // include: {
        //   subjects: true,
        //   rooms: true,
        // },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    })
  //   getAll: publicProcedure.query(({ ctx }) => {
  //     return ctx.db.example.findMany();
  //   }),

  // getProfileInstructions: protectedProcedure.query(() => {
  //   return "Please enter further profile details to continue";
  // }),
});