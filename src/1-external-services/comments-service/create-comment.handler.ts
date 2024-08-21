import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../lib/models/user.model';
import { createComment } from './comments.repository';
import { sendNotification } from '../lib/external-services/notifications-service';
import { getBlogPost } from '../lib/external-services/blogpost-service';

const config = {
  commentsTableName: 'comments',
  blogPostsServiceUrl: 'https://api.example.com/blogposts',
  externalNotificationServiceUrl: 'https://external-api.example.com/notifications',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const user = event.requestContext.authorizer?.user as User;
  const blogPostId = event.pathParameters?.id as string;
  const commentContent = JSON.parse(event.body || '{}').content as string;

  const blogPost = await getBlogPost(config.blogPostsServiceUrl, blogPostId);

  if (!blogPost.commentsEnabled && blogPost.ownerId !== user.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Comments are disabled for this blog post',
      }),
    };
  }

  await createComment({
    id: 'random-id',
    blogPostId,
    userId: user.id,
    content: commentContent,
  });

  await sendNotification(config.externalNotificationServiceUrl,{
    blogPostId,
    commentOwnerId: user.id,
    commentContent,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Comment created',
    }),
  };
};