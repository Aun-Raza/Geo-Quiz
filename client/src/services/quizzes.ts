/* eslint-disable linebreak-style */
import axios from 'axios';
import { QuizFormProps, QuizProps } from '../types/types.quiz';

class QuizService {
  http = axios.create({
    baseURL: 'http://localhost:8000',
  });

  async getQuizzes() {
    const response = await this.http.get<QuizProps[]>('/api/getQuizzes');
    return response;
  }

  async getQuiz(id: string | undefined) {
    const response = await this.http.get<QuizFormProps>('/api/getQuiz/' + id);
    return response;
  }
}

export default new QuizService();
