import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.list.nonNull.field("links", {
      type: "Link",
      resolve: async ({ id }, args, { prisma }, info) => {
        return prisma.user.findUnique({ where: { id } }).links();
      },
    });
    t.nonNull.list.nonNull.field("votes", {
      type: "Link",
      resolve({ id }, args, { prisma }) {
        return prisma.user.findUnique({ where: { id } }).votes();
      },
    });
  },
});
