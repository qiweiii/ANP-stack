import { arg, mutationField, nonNull } from 'nexus';

export const signupUser = mutationField((t) => {
  t.nonNull.field('signupUser', {
    type: 'User',
    args: {
      data: nonNull(
        arg({
          type: 'UserCreateInput',
        }),
      ),
    },
    resolve: (_, args, context) => {
      const postData = args.data.posts?.map((post: { title: string; content?: string | null }) => {
        return { title: post.title, content: post.content || undefined };
      });
      return context.prisma.user.create({
        data: {
          name: args.data.name,
          email: args.data.email,
          posts: {
            create: postData,
          },
        },
      });
    },
  });
});
