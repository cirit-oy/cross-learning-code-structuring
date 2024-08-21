import { putItem, queryItems } from '../lib/external-services/dynamodb';
import { config } from './get-comments.handler';
import { Comment } from '../lib/models/comment.model';

export const createComment = async (comment: Comment): Promise<void> => {
  await putItem(config.commentsTableName, comment);
}

export const queryComments = async (blogPostId: string): Promise<Comment[]> => {
  return queryItems(config.commentsTableName, 'blogPostId = :blogPostId', { ':blogPostId': { S: blogPostId } }) as Promise<Comment[]>;
}