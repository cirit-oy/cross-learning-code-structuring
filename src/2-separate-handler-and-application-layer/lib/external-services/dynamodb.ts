import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export const getItem = async (tableName: string, key: Record<string, any>) => {
  const dynamodbClient = new DynamoDBClient({});
  const documentClient = DynamoDBDocumentClient.from(dynamodbClient);

  return (await documentClient.send(new GetCommand({
    TableName: tableName,
    Key: key,
  }))).Item;
}

export const putItem = async (tableName: string, item: Record<string, any>) => {
  const dynamodbClient = new DynamoDBClient({});
  const documentClient = DynamoDBDocumentClient.from(dynamodbClient);

  await documentClient.send(new PutCommand({
    TableName: tableName,
    Item: item,
  }));
}

export const queryItems = async (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>) => {
  const dynamodbClient = new DynamoDBClient({});
  const documentClient = DynamoDBDocumentClient.from(dynamodbClient);

  return (await documentClient.send(new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  }))).Items || [];
}