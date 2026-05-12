export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}
