import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';

const config = {
  commentsTableName: 'comments',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const dynamodbClient = new DynamoDBClient({});
  const documentClient = DynamoDBDocumentClient.from(dynamodbClient);

  const comments = (await documentClient.send(new QueryCommand({
    TableName: config.commentsTableName,
    KeyConditionExpression: 'blogPostId = :blogPostId',
    ExpressionAttributeValues: {
      ':blogPostId': { S: event.pathParameters?.id },
    },
  }))).Items;

  return {
    statusCode: 200,
    body: JSON.stringify(comments),
  };
}