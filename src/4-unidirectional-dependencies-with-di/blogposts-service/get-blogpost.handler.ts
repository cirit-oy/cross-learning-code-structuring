import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../lib/models/user.model';
import { BlogPostService, makeBlogPostService } from './blogposts.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { makeDynamoDb } from '../lib/external-services/dynamodb';
import { makeCommentsService } from '../lib/external-services/comments-service';
import { makeBlogPostRepository } from './blogposts.repository';

export const config = {
  blogPostsTableName: 'blog-posts',
  commentsServiceUrl: 'https://api.example.com/comments',
}

interface Dependencies {
  blogPostService: BlogPostService;
}

export const makeHandler: (deps: Dependencies) => APIGatewayProxyHandler = ({ blogPostService }: Dependencies) => async (event) => {
  const user = event.requestContext.authorizer?.user as User;

  try {
    const {blogPost, comments} = await blogPostService.getBlogPost(event.pathParameters?.id as string, user.id);
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
          message: 'User has no right to access this blog post',
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

const commentsService = makeCommentsService({ serviceUrl: config.commentsServiceUrl });
const blogPostRepository = makeBlogPostRepository({ blogPostsTableName: config.blogPostsTableName, dynamoDB });
const blogPostService = makeBlogPostService({ commentsService, blogPostsRepository: blogPostRepository });

export const handler = makeHandler({ blogPostService });
