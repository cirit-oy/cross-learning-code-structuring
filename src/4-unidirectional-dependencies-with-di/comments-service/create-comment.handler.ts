import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../lib/models/user.model';
import { CommentsService, makeCommentsService } from './comments.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { makeDynamoDb } from '../lib/external-services/dynamodb';
import { makeCommentsRepository } from './comments.repository';
import { makeBlogPostService } from '../lib/external-services/blogpost-service';
import { makeNotificationsService } from '../lib/external-services/notifications-service';

export const config = {
  commentsTableName: 'comments',
  blogPostsServiceUrl: 'https://api.example.com/blogposts',
  externalNotificationServiceUrl: 'https://external-api.example.com/notifications',
}

interface Dependencies {
  commentsService: CommentsService;
}

export const makeHandler: (deps: Dependencies) => APIGatewayProxyHandler = ({commentsService}) => async (event) => {
  const user = event.requestContext.authorizer?.user as User;
  const blogPostId = event.pathParameters?.id as string;
  const commentContent = JSON.parse(event.body || '{}').content as string;

  try {
    await commentsService.createComment(user.id, blogPostId, commentContent);

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

const dynamoDBClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const dynamoDB = makeDynamoDb({documentClient});

const commentsRepository = makeCommentsRepository({ commentsTableName: config.commentsTableName, dynamoDB });
const blogPostsService = makeBlogPostService({ serviceUrl: config.blogPostsServiceUrl });
const notificationService = makeNotificationsService({ serviceUrl: config.externalNotificationServiceUrl });
const commentsService = makeCommentsService({ blogPostsService, commentsRepository, notificationService });

export const handler = makeHandler({ commentsService });