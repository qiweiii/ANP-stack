import { gql } from 'graphql-request';

// Create a new draft
export const createDraft = gql`
  mutation {
    createDraft(
      data: { title: "Join the Prisma Slack", content: "https://slack.prisma.io" }
      authorEmail: "alice@prisma.io"
    ) {
      id
      viewCount
      published
      author {
        id
        name
      }
    }
  }
`;
// Publish/unpublish an existing post
export const togglePublishPost = gql`
  mutation {
    togglePublishPost(id: 0) {
      id
      published
    }
  }
`;
// Increment the view count of a post
export const incrementPostViewCount = gql`
  mutation {
    incrementPostViewCount(id: 0) {
      id
      viewCount
    }
  }
`;
// Search for posts that contain a specific string in their title or content
export const searchPosts = gql`
  query {
    feed(searchString: "prisma") {
      id
      title
      content
      published
    }
  }
`;
// Paginate and order the returned posts
export const feed = gql`
  query {
    feed(skip: 2, take: 2, orderBy: { updatedAt: desc }) {
      id
      updatedAt
      title
      content
      published
    }
  }
`;
// Retrieve a single post
export const post = gql`
  query {
    postById(id: 0) {
      id
      title
      content
      published
    }
  }
`;
// Delete a post
export const deletePost = gql`
  mutation {
    deletePost(id: 0) {
      id
    }
  }
`;

describe('Post', () => {
  it('Empty test', async () => {
    return true;
  });
});
