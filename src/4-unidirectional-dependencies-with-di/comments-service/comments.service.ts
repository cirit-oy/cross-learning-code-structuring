import { CommentsRepository } from './comments.repository';
import { NotificationsService } from '../lib/external-services/notifications-service';
import { BlogPostService } from '../lib/external-services/blogpost-service';
import { userIsAllowedToAccessBlogPost } from '../blogposts-service/blogposts.domain';

export interface CommentsService {
  createComment(userId: string, blogPostId: string, commentContent: string): Promise<void>;
}

export interface Dependencies {
  blogPostsService: BlogPostService;
  notificationService: NotificationsService;
  commentsRepository: CommentsRepository
}

export const makeCommentsService = ({ blogPostsService, commentsRepository, notificationService }: Dependencies): CommentsService => ({
  createComment: async (userId: string, blogPostId: string, commentContent: string) => {
    const blogPost = await blogPostsService.getBlogPost(blogPostId);

    if (!userIsAllowedToAccessBlogPost(blogPost, userId)) {
      throw new Error('Comments are disabled for this blog post')
    }

    await commentsRepository.createComment({
      id: 'random-id',
      blogPostId,
      userId,
      content: commentContent,
    });

    await notificationService.sendNotification({
      blogPostId,
      commentOwnerId: userId,
      commentContent,
    });
  }
});