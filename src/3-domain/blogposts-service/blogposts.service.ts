import { getComments } from '../lib/external-services/comments-service';
import { BlogPost } from '../lib/models/blogpost.model';
import * as blogPostsRepository from './blogposts.repository';
import { config } from './get-blogpost.handler';
import { Comment } from '../lib/models/comment.model';
import { userIsAllowedToAccessBlogPost } from './blogposts.domain';

export const getBlogPost = async (blogPostId: string, userId: string): Promise<{ blogPost: BlogPost, comments: Comment[] }> => {
  const blogPost = await blogPostsRepository.getBlogPost(blogPostId);

  if (!userIsAllowedToAccessBlogPost(blogPost, userId)) {
    throw new Error('User has no right to access this blog post');
  }

  const comments = await getComments(config.commentsServiceUrl, blogPostId);

  return {
    blogPost,
    comments,
  }
};