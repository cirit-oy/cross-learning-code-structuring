import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { User } from '../lib/models/user.model';
import { BlogPost } from '../lib/models/blogpost.model';

const config = {
  blogPostsTableName: 'blog-posts',
  commentsServiceUrl: 'https://api.example.com/comments',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const user = event.requestContext.authorizer?.user as User;
  const dynamodbClient = new DynamoDBClient({});
  const documentClient = DynamoDBDocumentClient.from(dynamodbClient);

  const blogPostId = event.pathParameters?.id as string;

  const blogPost = (await documentClient.send(new GetCommand({
    TableName: config.blogPostsTableName,
    Key: {
      id: blogPostId,
    },
  }))).Item as BlogPost;

  if (blogPost.isPrivate && blogPost.ownerId !== user.id) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'User has no right to access this blog post',
      }),
    };
  }

  const commentsResponse = await fetch(`${config.commentsServiceUrl}?blogPostId=${blogPostId}`);
  const comments = await commentsResponse.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      blogPost,
      comments,
    }),
  };
};