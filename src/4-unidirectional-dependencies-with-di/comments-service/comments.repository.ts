import { DynamoDb } from '../lib/external-services/dynamodb';
import { Comment } from '../lib/models/comment.model';

export interface CommentsRepository {
  createComment(comment: Comment): Promise<void>;
  queryComments(blogPostId: string): Promise<Comment[]>;
}

interface Dependencies {
  commentsTableName: string;
  dynamoDB: DynamoDb;
}

export const makeCommentsRepository = ({ commentsTableName, dynamoDB }: Dependencies): CommentsRepository => ({
  createComment: async (comment: Comment) => {
    await dynamoDB.putItem(commentsTableName, comment);
  },
  queryComments: async (blogPostId: string) => {
    return dynamoDB.queryItems(commentsTableName, 'blogPostId = :blogPostId', { ':blogPostId': { S: blogPostId } }) as Promise<Comment[]>;
  }
});