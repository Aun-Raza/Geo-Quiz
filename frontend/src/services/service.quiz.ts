import axios from 'axios';
import { QuizTableProps, QuizProps, QuizAddProps } from '../types';

class QuizService {
  http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  async getQuizzes() {
    try {
      console.log(process);
    } catch (error) {
      console.log(error);
    }
    const response = await this.http.get<QuizTableProps[]>('/api/getQuizzes');
    return response;
  }

  async getQuiz(id: string | undefined) {
    const response = await this.http.get<QuizProps>('/api/getQuiz/' + id);
    return response;
  }

  async createQuiz(quiz: QuizAddProps, token: string) {
    const response = await this.http.post<QuizProps>('/api/createQuiz', quiz, {
      headers: { 'x-auth-token': token },
    });
    return response;
  }

  async updateQuiz(id: string, quiz: QuizAddProps, token: string) {
    const response = await this.http.put<QuizProps>(
      `/api/updateQuiz/${id}`,
      quiz,
      {
        headers: { 'x-auth-token': token },
      }
    );
    return response;
  }

  async deleteQuiz(id: number, token: string) {
    const response = await this.http.delete(`/api/deleteQuiz/${id}`, {
      headers: { 'x-auth-token': token },
    });
    return response;
  }
}

export default new QuizService();
