import * as commentRepository from './comments.repository';
import { sendNotification } from '../lib/external-services/notifications-service';
import { getBlogPost } from '../lib/external-services/blogpost-service';
import { config } from './create-comment.handler'
import { userIsAllowedToAccessBlogPost } from '../blogposts-service/blogposts.domain';

export const createComment = async (userId: string, blogPostId: string, commentContent: string) => {
  const blogPost = await getBlogPost(config.blogPostsServiceUrl, blogPostId);

  if (!userIsAllowedToAccessBlogPost(blogPost, userId)) {
    throw new Error('Comments are disabled for this blog post')
  }

  await commentRepository.createComment({
    id: 'random-id',
    blogPostId,
    userId,
    content: commentContent,
  });

  await sendNotification(config.externalNotificationServiceUrl,{
    blogPostId,
    commentOwnerId: userId,
    commentContent,
  });
};