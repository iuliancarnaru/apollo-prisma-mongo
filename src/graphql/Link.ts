import { extendType, nonNull, stringArg, objectType } from "nexus";

//objectType is used to create a new type in your GraphQL schema
export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt");
    t.field("postedBy", {
      type: "User",
      resolve: async ({ id }, args, { prisma }, info) => {
        return prisma.link.findUnique({ where: { id } }).postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve: ({ id }, args, { prisma }, info) => {
        return prisma.link.findUnique({ where: { id } }).voters();
      },
    });
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      // a resolver is the implementation for a GraphQL field.
      resolve: async (parent, args, { prisma }, info) => {
        return await prisma.link.findMany();
      },
    });
  },
});

export const CreateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve: async (parent, args, { prisma, userId }, info) => {
        const { description, url } = args;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const newLink = await prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } },
          },
        });

        return newLink;
      },
    });
  },
});
