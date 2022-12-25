import { queryField } from 'nexus';

export const allUsers = queryField((t) => {
  t.nonNull.list.nonNull.field('allUsers', {
    type: 'User',
    resolve: (_parent, _args, context) => {
      return context.prisma.user.findMany();
    },
  });
});
