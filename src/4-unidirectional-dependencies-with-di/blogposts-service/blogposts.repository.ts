import { BlogPost } from '../lib/models/blogpost.model';
import { DynamoDb } from '../lib/external-services/dynamodb';

export interface BlogPostRepository {
  getBlogPost(blogPostId: string): Promise<BlogPost>;
}

interface Dependencies {
  blogPostsTableName: string;
  dynamoDB: DynamoDb;
}

export const makeBlogPostRepository = (deps: Dependencies): BlogPostRepository => {
  return {
    getBlogPost: async (blogPostId: string) => {
      return deps.dynamoDB.getItem(deps.blogPostsTableName, { id: blogPostId }) as Promise<BlogPost>;
    }
  }
}