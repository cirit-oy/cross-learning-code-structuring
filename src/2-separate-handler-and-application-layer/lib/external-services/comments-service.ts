import { Comment } from '../models/comment.model';

export const getComments = async (serviceUrl: string, blogPostId: string): Promise<Comment[]> => {
  const response = await fetch(`${serviceUrl}/${blogPostId}/comments`);
  return response.json() as Promise<Comment[]>;
}