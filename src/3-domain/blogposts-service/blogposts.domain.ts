import { BlogPost } from '../lib/models/blogpost.model';

export const userIsAllowedToAccessBlogPost = (blogPost: BlogPost, userId: string): boolean => {
  return !blogPost.isPrivate || blogPost.ownerId === userId;
}