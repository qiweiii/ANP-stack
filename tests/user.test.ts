import { gql, GraphQLClient } from 'graphql-request';
import { PrismaClient } from '@prisma/client';

const db: PrismaClient = new PrismaClient();
const client: GraphQLClient = new GraphQLClient(`http://localhost:${process.env.PORT}/graphql`);

// Retrieve the drafts of a user
const draftsByUser = gql`
  query draftsByUser($userUniqueInput: UserUniqueInput!) {
    draftsByUser(userUniqueInput: $userUniqueInput) {
      id
      title
      content
      published
      author {
        id
        name
        email
      }
    }
  }
`;
// Create a new user
const signupUser = gql`
  mutation signupUser($data: UserCreateInput!) {
    signupUser(data: $data) {
      name
      email
      id
    }
  }
`;

describe('User', () => {
  it('Get drafts by user email', async () => {
    const { draftsByUser: drafts } = await client.request(draftsByUser, {
      userUniqueInput: { email: 'test2@example.com' },
    });
    expect(drafts.length).toEqual(1);
    expect(drafts[0].title).toEqual('ANP stack on YouTube');
    const draftsFromDb = await db.post.findMany({
      where: {
        id: drafts[0].id,
      },
    });
    expect(draftsFromDb?.length).toEqual(1);
    expect(draftsFromDb?.[0]?.title).toEqual('ANP stack on YouTube');
  });

  it('Create a new user', async () => {
    // clear this test user before creating
    await db.$executeRaw`delete from public."User" where "email" = 'yangqiwei97@gmail.com'`;
    const { signupUser: newUser } = await client.request(signupUser, {
      data: {
        name: 'QiweiTest',
        email: 'yangqiwei97@gmail.com',
      },
    });
    expect(newUser.name).toEqual('QiweiTest');
    expect(newUser.email).toEqual('yangqiwei97@gmail.com');
    const userFromDb = await db.user.findFirstOrThrow({
      where: {
        id: newUser.id,
      },
    });
    expect(userFromDb.name).toEqual('QiweiTest');
    expect(userFromDb.email).toEqual('yangqiwei97@gmail.com');
    await db.$executeRaw`delete from public."User" where "email" = 'yangqiwei97@gmail.com'`;
  });
});
