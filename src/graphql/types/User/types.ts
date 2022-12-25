import { inputObjectType, objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.string('name');
    t.nonNull.string('email');
    t.nonNull.list.nonNull.field('posts', {
      type: 'Post',
      resolve: (parent, _, context) => {
        return (
          context.prisma.user
            .findUnique({
              where: { id: parent.id || undefined },
            })
            // TODO: fix this type problem
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .posts() as any
        );
      },
    });
  },
});

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id');
    t.string('email');
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email');
    t.string('name');
    t.list.nonNull.field('posts', { type: 'PostCreateInput' });
  },
});
