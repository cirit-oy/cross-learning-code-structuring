import { BlogPost } from '../models/blogpost.model';

export const getBlogPost = async (serviceUrl: string, blogPostId: string): Promise<BlogPost> => {
  const response = await fetch(`${serviceUrl}/${blogPostId}`);
  return response.json() as Promise<BlogPost>;
}