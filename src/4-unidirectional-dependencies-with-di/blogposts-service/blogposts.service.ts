import { CommentsService } from '../lib/external-services/comments-service';
import { BlogPost } from '../lib/models/blogpost.model';
import { BlogPostRepository } from './blogposts.repository';
import { Comment } from '../lib/models/comment.model';
import { userIsAllowedToAccessBlogPost } from './blogposts.domain';

export interface BlogPostService {
  getBlogPost(blogPostId: string, userId: string): Promise<{ blogPost: BlogPost, comments: Comment[] }>;
}

export interface Dependencies {
  commentsService: CommentsService;
  blogPostsRepository: BlogPostRepository;
}

export const makeBlogPostService = (deps: Dependencies): BlogPostService => ({
  getBlogPost: async (blogPostId: string, userId: string) => {
    const blogPost = await deps.blogPostsRepository.getBlogPost(blogPostId);

    if (!userIsAllowedToAccessBlogPost(blogPost, userId)) {
      throw new Error('User has no right to access this blog post');
    }

    const comments = await deps.commentsService.getComments(blogPostId);

    return {
      blogPost,
      comments,
    }
  }
});