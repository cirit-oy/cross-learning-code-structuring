import { BlogPost } from '../lib/models/blogpost.model';

export const userIsAllowedToCreateComment = (blogPost: BlogPost, userId: string): boolean => {
  return blogPost.commentsEnabled || blogPost.ownerId === userId;
}