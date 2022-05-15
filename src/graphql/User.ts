import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.list.nonNull.field("links", {
      type: "Link",
      resolve: async ({ id }, args, { prisma }, info) => {
        return prisma.user.findUnique({ where: { id } }).links();
      },
    });
  },
});
