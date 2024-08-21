import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { User } from '../lib/models/user.model';
import { BlogPost } from '../lib/models/blogpost.model';

const config = {
  commentsTableName: 'comments',
  blogPostsServiceUrl: 'https://api.example.com/blogposts',
  externalNotificationServiceUrl: 'https://external-api.example.com/notifications',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const dynamodbClient = new DynamoDBClient({});
  const documentClient = DynamoDBDocumentClient.from(dynamodbClient);

  const user = event.requestContext.authorizer?.user as User;
  const blogPostId = event.pathParameters?.id as string;
  const commentContent = JSON.parse(event.body || '{}').content as string;

  const blogPostResponse = await fetch(`${config.blogPostsServiceUrl}/${blogPostId}`);
  const blogPost = await blogPostResponse.json() as BlogPost;

  if (!blogPost.commentsEnabled && blogPost.ownerId !== user.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Comments are disabled for this blog post',
      }),
    };
  }

  await documentClient.send(new PutCommand({
    TableName: config.commentsTableName,
    Item: {
      id: 'random-id',
      blogPostId,
      ownerId: user.id,
      content: commentContent,
    },
  }));

  await fetch(config.externalNotificationServiceUrl, {
    method: 'POST',
    body: JSON.stringify({
      blogPostId,
      commentOwnerId: user.id,
      commentContent,
    }),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Comment created',
    }),
  };
};