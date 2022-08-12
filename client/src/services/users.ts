import axios from 'axios';
import { loginProps, User } from '../interfaces/User';

class UserService {
    http = axios.create({
        baseURL: 'http://localhost:8000',
    });

    async loginUser({ username, password }: loginProps) {
        const response = await this.http.post<User>('/api/loginUser', {
            username,
            password,
        });
        return response;
    }
}

export default new UserService();
