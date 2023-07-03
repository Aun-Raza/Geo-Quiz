import axios from 'axios';
import { LoginProps, UserQuizProps } from '../types';

interface SuccessMessage {
  msg: string;
}

class UserService {
  http = axios.create({
    baseURL: 'http://localhost:8000',
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
