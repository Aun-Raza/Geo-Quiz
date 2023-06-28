import axios from 'axios';
import { QuizTableProps, QuizProps } from '../types';

class QuizService {
  http = axios.create({
    baseURL: 'http://localhost:8000',
  });

  async getQuizzes() {
    const response = await this.http.get<QuizTableProps[]>('/api/getQuizzes');
    return response;
  }

  async getQuiz(id: string | undefined) {
    const response = await this.http.get<QuizProps>('/api/getQuiz/' + id);
    return response;
  }
}

export default new QuizService();
