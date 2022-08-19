import axios from 'axios';
import { IQuiz } from '../interfaces/IQuiz';

class QuizService {
  http = axios.create({
    baseURL: 'http://localhost:8000',
  });

  async getQuizzes() {
    const response = await this.http.get<IQuiz[]>('/api/getQuizzes');
    return response;
  }
}

export default new QuizService();
