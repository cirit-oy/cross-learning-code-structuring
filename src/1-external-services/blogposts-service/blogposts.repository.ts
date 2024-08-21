import { BlogPost } from '../lib/models/blogpost.model';
import { config } from './get-blogpost.handler';
import { getItem } from '../lib/external-services/dynamodb';

export const getBlogPost = async (blogPostId: string): Promise<BlogPost> => {
  return getItem(config.blogPostsTableName, { id: blogPostId }) as Promise<BlogPost>;
}