export interface BlogPost {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  isPrivate: boolean;
  commentsEnabled: boolean;
}