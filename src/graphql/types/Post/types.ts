import { inputObjectType, objectType } from 'nexus';
import { SortOrder } from '../CommonType';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('title');
    t.string('content');
    t.nonNull.boolean('published');
    t.nonNull.int('viewCount');
    t.field('author', {
      type: 'User',
      resolve: (parent, _, context) => {
        return context.prisma.post
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author();
      },
    });
  },
});

export const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: SortOrder });
  },
});

export const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  definition(t) {
    t.nonNull.string('title');
    t.string('content');
  },
});
