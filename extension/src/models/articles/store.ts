export interface IArticle {
  url: string;
  title: string;
  content: string;
  id: string;
  summary: string | null;
  createdAt: string;
  isRead: boolean;
}
