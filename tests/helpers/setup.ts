import { PrismaClient, Prisma } from '@prisma/client';
import { setupServer } from '../../src/setupServer';

let db: PrismaClient = new PrismaClient();
let shutdown: () => Promise<void>;

const testUserData: Prisma.UserCreateInput[] = [
  {
    name: 'test user 1',
    email: 'test1@example.com',
    posts: {
      create: [
        {
          title: 'Join ANP Slack',
          content: 'https://github.com/qiweiii/ANP-stack',
          published: true,
        },
      ],
    },
  },
  {
    name: 'test user 2',
    email: 'test2@example.com',
    posts: {
      create: [
        {
          title: 'Ask a question about ANP stack on GitHub',
          content: 'https://github.com/qiweiii/ANP-stack',
          published: true,
          viewCount: 128,
        },
        {
          title: 'ANP stack on YouTube',
          content: 'https://github.com/qiweiii/ANP-stack',
        },
      ],
    },
  },
];

const createTestData = async (usersData: Prisma.UserCreateInput[]) => {
  for (const u of usersData) {
    await db.user.create({
      data: u,
    });
  }
  console.log(`Test data creation finished.`);
};

const clearTestData = async () => {
  await db.$executeRaw`delete from public."User" where "name" in ('test user 1', 'test user 2')`;
  await db.$executeRaw`delete from public."Post" where "authorId" is null`;
  console.log(`Test data deletion finished.`);
};

beforeAll(async () => {
  shutdown = await setupServer();
  db = new PrismaClient();
  await db.$connect();
  // clear db before each test
  await clearTestData();
  // create test users and posts
  await createTestData(testUserData);
});

afterAll(async () => {
  await clearTestData();
  await db.$disconnect();
  await shutdown();
});
