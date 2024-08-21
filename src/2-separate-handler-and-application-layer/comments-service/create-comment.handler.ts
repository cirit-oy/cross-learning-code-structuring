import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../lib/models/user.model';
import { createComment } from './comment.service';

export const config = {
  commentsTableName: 'comments',
  blogPostsServiceUrl: 'https://api.example.com/blogposts',
  externalNotificationServiceUrl: 'https://external-api.example.com/notifications',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const user = event.requestContext.authorizer?.user as User;
  const blogPostId = event.pathParameters?.id as string;
  const commentContent = JSON.parse(event.body || '{}').content as string;

  try {
    await createComment(user.id, blogPostId, commentContent);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Comment created successfully',
      }),
    };
  } catch (error) {
    if ((error as Error).message === 'Comments are disabled for this blog post') {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: 'Comments are disabled for this blog post',
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