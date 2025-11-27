export interface Intent {
  id: string;
  phrase: string;
}

export interface Topic {
  id: string;
  value: string;
  count?: number;
}

export interface Article {
  id: string;
  title: string;
  url: string;
  summary: string;
  contentSnippet: string;
  isRead: boolean;
  isBookmarked: boolean;
  topics: Topic[];
  intents: Intent[];
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  total?: number;
  bookmarked?: number;
  unread?: number;
  opened?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  joinedOn?: string;
  stats?: UserStats;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
