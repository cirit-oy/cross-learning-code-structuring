import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../lib/models/user.model';
import { getComments } from '../lib/external-services/comments-service';
import { getBlogPost } from './blogposts.repository';

export const config = {
  blogPostsTableName: 'blog-posts',
  commentsServiceUrl: 'https://api.example.com/comments',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const user = event.requestContext.authorizer?.user as User;
  const blogPostId = event.pathParameters?.id as string;

  const blogPost = await getBlogPost(blogPostId);

  if (blogPost.isPrivate && blogPost.ownerId !== user.id) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'User has no right to access this blog post',
      }),
    };
  }

  const comments = await getComments(config.commentsServiceUrl, blogPostId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      blogPost,
      comments,
    }),
  };
};