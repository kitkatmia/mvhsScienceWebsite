import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

// const Subject = z.object({
//   name: z.string(),
// });

// const Room = z.object({
//   number: z.string(),
// });

const UserProps = z.object({
  name: z.string().optional(),
  school: z.string().optional(),
  subjects: z.array(z.string()),
  rooms: z.array(z.string()),
});

export const userRouter = createTRPCRouter({
  upsertUserAccount: protectedProcedure
    .input(UserProps)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const userAccount = await ctx.db.$transaction(async (prisma) => {
        // Upsert user account
        const upsertedUserAccount = await prisma.userAccount.upsert({
          where: { userId: userId },
          create: {
            userId,
            name: input.name,
            school: input.school,
            subjects: {
              create: input.subjects.map((subject) => ({ name: subject })),
            },
            rooms: {
              create: input.rooms.map((room) => ({ number: room })),
            },
          },
          update: {
            name: input.name,
            school: input.school,
            subjects: {
              // First, delete existing subjects
              deleteMany: { userAccountId: userId },
              // Then, create new ones
              create: input.subjects.map((subject) => ({ name: subject })),
            },
            rooms: {
              // First, delete existing rooms
              deleteMany: { userAccountId: userId },
              // Then, create new ones
              create: input.rooms.map((room) => ({ number: room })),
            },
          },
          include: {
            subjects: true,
            rooms: true,
          },
        });

        return upsertedUserAccount;
      });

      return userAccount;
    }),
  createUserAccount: protectedProcedure
    .input(UserProps)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const userAccount = await ctx.db.userAccount.create({
        data: {
          userId,
          name: input.name,
          school: input.school,
          subjects: {
            create: input.subjects.map((subject) => ({ name: subject })),
          },
          rooms: {
            create: input.rooms.map((room) => ({ number: room })),
          },
        },
        include: {
          subjects: true,
          rooms: true,
        },
      });

      return userAccount;
    }),

  updateUserAccount: protectedProcedure
    .input(UserProps)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db.$transaction(async (prisma) => {
        // Delete existing subjects and rooms for this user account
        await prisma.subject.deleteMany({
          where: { userAccountId: userId },
        });
        await prisma.room.deleteMany({
          where: { userAccountId: userId },
        });

        // Logic to create/update subjects and rooms needs to be implemented here
      });

      const updatedUserAccount = await ctx.db.userAccount.update({
        where: { userId: userId },
        data: {
          name: input.name,
          school: input.school,
          subjects: {
            create: input.subjects.map((subject) => ({ name: subject })),
          },
          rooms: {
            create: input.rooms.map((room) => ({ number: room })),
          },
        },
        include: {
          subjects: true,
          rooms: true,
        },
      });

      return updatedUserAccount;
    }),

  getUserByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.userAccount.findUnique({
        where: { email: input.email },
        include: {
          subjects: true,
          rooms: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),

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

  // getProfileInstructions: protectedProcedure.query(() => {
  //   return "Please enter further profile details to continue";
  // }),
});
