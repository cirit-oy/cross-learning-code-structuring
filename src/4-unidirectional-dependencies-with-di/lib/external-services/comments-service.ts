import { Comment } from '../models/comment.model';

export interface CommentsService {
  getComments(blogPostId: string): Promise<Comment[]>;
}

interface Dependencies {
  serviceUrl: string;
}

export const makeCommentsService = ({ serviceUrl }: Dependencies): CommentsService => {
  return {
    getComments: async (blogPostId: string) => {
      const response = await fetch(`${serviceUrl}/${blogPostId}/comments`);
      return response.json() as Promise<Comment[]>;
    }
  }
}