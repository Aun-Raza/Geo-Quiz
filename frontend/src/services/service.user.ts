import axios from 'axios';
import { LoginProps, UserQuizProps } from '../types';

interface SuccessMessage {
  msg: string;
}

class UserService {
  http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  async getUser(id: string) {
    const response = await this.http.get<UserQuizProps>(`/api/getUser/${id}`);
    return response;
  }

  async loginUser({ username, password }: LoginProps) {
    const response = await this.http.post<SuccessMessage>('/api/loginUser', {
      username,
      password,
    });
    return response;
  }
}

export default new UserService();
