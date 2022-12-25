import * as NexusSchema from 'nexus';
import * as path from 'path';
import { applyMiddleware } from 'graphql-middleware';

import * as types from './types';
import { auth } from './middleware';

const schema = NexusSchema.makeSchema({
  types,
  features: {
    abstractTypeStrategies: {
      resolveType: false,
      isTypeOf: false,
      __typename: true,
    },
  },
  plugins: [
    NexusSchema.connectionPlugin({
      additionalArgs: {
        orderBy: NexusSchema.list(NexusSchema.nonNull('OrderBy')),
      },
      extendConnection: {
        totalCount: { type: NexusSchema.nullable('Int') },
      },
    }),
    NexusSchema.fieldAuthorizePlugin({
      formatError: () => {
        const error = new Error('Not authorized');
        error.name = 'UNAUTHORIZED';
        return error;
      },
    }),
  ],
  outputs: {
    schema: path.join(__dirname, './schema.graphql'),
    typegen: path.join(__dirname, '../../node_modules/@types/nexus-typegen/index.d.ts'),
  },
  // Typing for the GraphQL context
  contextType: {
    module: require.resolve('./context'),
    export: 'GQLContext',
  },
  sourceTypes: {
    modules: [
      {
        module: require.resolve(path.join(__dirname, '../../node_modules/.prisma/client/index.d.ts')),
        alias: 'prisma',
      },
    ],
  },
});

export const schemaWithMiddleware = applyMiddleware(schema, {
  Query: auth,
  Mutation: auth,
});

export default schema;
