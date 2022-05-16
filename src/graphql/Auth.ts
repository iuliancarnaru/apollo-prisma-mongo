import { User } from "@prisma/client";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { extendType, objectType, nonNull, stringArg } from "nexus";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (parent, args, { prisma }, info) => {
        const { email, name } = args;

        const password = await argon2.hash(args.password);
        const user = await prisma.user.create({
          data: { email, name, password },
        });
        const token = jwt.sign(
          { userId: user.id },
          `${process.env.APP_SECRET}`
        );
        return {
          token,
          user,
        };
      },
    });

    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (parent, { email, password }, { prisma }, info) => {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error(`No such user found`);
        }

        const valid = await argon2.verify(user.password, password);

        if (!valid) {
          throw new Error(`Invalid password`);
        }

        const token = jwt.sign(
          { userId: user.id },
          `${process.env.APP_SECRET}`
        );

        return {
          token,
          user: user as User,
        };
      },
    });
  },
});
