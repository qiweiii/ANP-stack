import { mutationField, arg, nonNull, stringArg, intArg } from 'nexus';

export const createDraft = mutationField((t) => {
  t.field('createDraft', {
    type: 'Post',
    args: {
      data: nonNull(
        arg({
          type: 'PostCreateInput',
        }),
      ),
      authorEmail: nonNull(stringArg()),
    },
    resolve: (_, args, context) => {
      return context.prisma.post.create({
        data: {
          title: args.data.title,
          content: args.data.content,
          author: {
            connect: { email: args.authorEmail },
          },
        },
      });
    },
  });
});

export const togglePublishPost = mutationField((t) => {
  t.field('togglePublishPost', {
    type: 'Post',
    args: {
      id: nonNull(intArg()),
    },
    resolve: async (_, args, context) => {
      try {
        const post = await context.prisma.post.findUnique({
          where: { id: args.id || undefined },
          select: {
            published: true,
          },
        });
        return context.prisma.post.update({
          where: { id: args.id || undefined },
          data: { published: !post?.published },
        });
      } catch (e) {
        throw new Error(`Post with ID ${args.id} does not exist in the database.`);
      }
    },
  });
});

export const incrementPostViewCount = mutationField((t) => {
  t.field('incrementPostViewCount', {
    type: 'Post',
    args: {
      id: nonNull(intArg()),
    },
    resolve: (_, args, context) => {
      return context.prisma.post.update({
        where: { id: args.id || undefined },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    },
  });
});

export const deletePost = mutationField((t) => {
  t.field('deletePost', {
    type: 'Post',
    args: {
      id: nonNull(intArg()),
    },
    resolve: (_, args, context) => {
      return context.prisma.post.delete({
        where: { id: args.id },
      });
    },
  });
});
