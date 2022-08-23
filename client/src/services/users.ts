import axios from 'axios';
import { LoginProps } from '../types/types.user';

interface SuccessMessage {
  msg: string;
}

class UserService {
  http = axios.create({
    baseURL: 'http://localhost:8000',
  });

  async loginUser({ username, password }: LoginProps) {
    const response = await this.http.post<SuccessMessage>('/api/loginUser', {
      username,
      password,
    });
    return response;
  }
}

export default new UserService();
