import axios from 'axios';
import { QuizProps } from '../types/types.quiz';

class QuizService {
  http = axios.create({
    baseURL: 'http://localhost:8000',
  });

  async getQuizzes() {
    const response = await this.http.get<QuizProps[]>('/api/getQuizzes');
    return response;
  }
}

export default new QuizService();
