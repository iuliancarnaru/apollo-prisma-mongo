import { objectType, extendType, nonNull, stringArg, idArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

//objectType is used to create a new type in your GraphQL schema
export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

// everything is stored only in-memory rather than being persisted in a database.
// let links: NexusGenObjects["Link"][] = [
//   {
//     id: 1,
//     url: "www.howtographql.com",
//     description: "Fullstack tutorial for GraphQL",
//   },
//   {
//     id: 2,
//     url: "graphql.org",
//     description: "GraphQL official website",
//   },
// ];

// export const GetAllLinksQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.nonNull.list.nonNull.field("getAllLinks", {
//       type: "Link",
//       // a resolver is the implementation for a GraphQL field.
//       resolve(parent, args, context, info) {
//         return links;
//       },
//     });
//   },
// });

export const GetAllLinksQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("getAllLinks", {
      type: "Link",
      // a resolver is the implementation for a GraphQL field.
      resolve: async (parent, args, { prisma }, info) => {
        return await prisma.link.findMany();
      },
    });
  },
});

// export const CreateLinkMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.nonNull.field("createLink", {
//       type: "Link",
//       args: {
//         description: nonNull(stringArg()),
//         url: nonNull(stringArg()),
//       },
//       resolve(parent, args, context, info) {
//         const { description, url } = args;
//         let id = links.length + 1;

//         const link = {
//           id,
//           description,
//           url,
//         };

//         links.push(link);
//         return link;
//       },
//     });
//   },
// });

export const CreateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createLink", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve: async (parent, args, { prisma }, info) => {
        const { description, url } = args;
        const newLink = await prisma.link.create({
          data: {
            description,
            url,
          },
        });

        return newLink;
      },
    });
  },
});
