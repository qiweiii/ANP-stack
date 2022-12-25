import { intArg, nonNull, stringArg, arg, queryField } from 'nexus';

export const postById = queryField((t) => {
  t.nullable.field('postById', {
    type: 'Post',
    args: {
      id: intArg(),
    },
    resolve: (_parent, args, context) => {
      return context.prisma.post.findUnique({
        where: { id: args.id || undefined },
      });
    },
  });
});

export const feed = queryField((t) => {
  t.nonNull.list.nonNull.field('feed', {
    type: 'Post',
    args: {
      searchString: stringArg(),
      skip: intArg(),
      take: intArg(),
      orderBy: arg({
        type: 'PostOrderByUpdatedAtInput',
      }),
    },
    resolve: (_parent, args, context) => {
      const or = args.searchString
        ? {
            OR: [{ title: { contains: args.searchString } }, { content: { contains: args.searchString } }],
          }
        : {};
      return context.prisma.post.findMany({
        where: {
          published: true,
          ...or,
        },
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      });
    },
  });
});

export const draftsByUser = queryField((t) => {
  t.list.field('draftsByUser', {
    type: 'Post',
    args: {
      userUniqueInput: nonNull(
        arg({
          type: 'UserUniqueInput',
        }),
      ),
    },
    resolve: (_parent, args, context) => {
      return context.prisma.user
        .findUnique({
          where: {
            id: args.userUniqueInput.id || undefined,
            email: args.userUniqueInput.email || undefined,
          },
        })
        .posts({
          where: {
            published: false,
          },
        });
    },
  });
});
