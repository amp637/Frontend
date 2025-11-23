export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  token?: string;
  message?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
