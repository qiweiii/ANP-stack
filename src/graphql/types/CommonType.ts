import { asNexusMethod, enumType, inputObjectType } from 'nexus';
import { GraphQLJSONObject, DateTimeResolver } from 'graphql-scalars';

export const JsonObject = asNexusMethod(GraphQLJSONObject, 'jsonObject');
export const DateTime = asNexusMethod(DateTimeResolver, 'datetime');

// TODO: put common graphql types that can be used in multiple places here
export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
});

export const OrderBy = inputObjectType({
  name: 'OrderBy',
  definition(t) {
    t.nonNull.string('key');
    t.field('order', {
      type: SortOrder,
    });
  },
});
