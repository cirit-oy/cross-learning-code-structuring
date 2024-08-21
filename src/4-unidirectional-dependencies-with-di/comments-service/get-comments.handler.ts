import { APIGatewayProxyHandler } from 'aws-lambda';
import { queryComments } from './comments.repository';

export const config = {
  commentsTableName: 'comments',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const comments = await queryComments(event.pathParameters?.blogPostId as string);

  return {
    statusCode: 200,
    body: JSON.stringify(comments),
  };
}