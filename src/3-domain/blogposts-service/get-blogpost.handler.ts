import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../lib/models/user.model';
import { getBlogPost } from './blogposts.service';

export const config = {
  blogPostsTableName: 'blog-posts',
  commentsServiceUrl: 'https://api.example.com/comments',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const user = event.requestContext.authorizer?.user as User;

  try {
    const {blogPost, comments} = await getBlogPost(event.pathParameters?.id as string, user.id);
    return {
      statusCode: 200,
      body: JSON.stringify({
        blogPost,
        comments,
      }),
    };
  } catch (error) {
    if ((error as Error).message === 'User has no right to access this blog post') {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: 'Access denied',
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Internal server error',
        }),
      };
    }
  }
};