import { User } from './User.interface';

export interface AuthResponse {
  user: User;
  token: string;
}
export interface AuthResponseToken {
  Success: string;
  Message: string;
  data: string;
}
