import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export interface DynamoDb {
  getItem(tableName: string, key: Record<string, any>): Promise<Record<string, any> | undefined>;
  putItem(tableName: string, item: Record<string, any>): Promise<void>;
  queryItems(tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>): Promise<Record<string, any>[]>;
}

interface Dependencies {
  documentClient: DynamoDBDocumentClient;
}

export const makeDynamoDb = ({ documentClient }: Dependencies): DynamoDb => {
  // You could instantiate the DynamoDB SDK client here, but it's nice for testing to pass it in as a dependency

  return {
    getItem: async (tableName, key) => {
      return (await documentClient.send(new GetCommand({
        TableName: tableName,
        Key: key,
      }))).Item;
    },
    putItem: async (tableName, item) => {
      await documentClient.send(new PutCommand({
        TableName: tableName,
        Item: item,
      }));
    },
    queryItems: async (tableName, keyConditionExpression, expressionAttributeValues) => {
      return (await documentClient.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      }))).Items || [];
    },
  };
}