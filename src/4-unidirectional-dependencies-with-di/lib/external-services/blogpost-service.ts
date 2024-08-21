import { BlogPost } from '../models/blogpost.model';

export interface BlogPostService {
  getBlogPost(blogPostId: string): Promise<BlogPost>;
}

interface Dependencies {
  serviceUrl: string;
}

export const makeBlogPostService = ({ serviceUrl }: Dependencies): BlogPostService => {
  return {
    getBlogPost: async (blogPostId: string) => {
      const response = await fetch(`${serviceUrl}/${blogPostId}`);
      return response.json() as Promise<BlogPost>;
    }
  }
}
