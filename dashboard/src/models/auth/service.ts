export interface IUserLoginServicePayload {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  article_count?: number;
  token: string;
}
