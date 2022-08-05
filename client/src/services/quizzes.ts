import axios from "axios";
import { Quiz } from "../interfaces/Quiz";

interface Response {
    data: Quiz[];
}

class QuizService {
    http = axios.create({
        baseURL: "http://localhost:8000",
    });

    async getQuizzes() {
        const { data: quizzes } = await this.http.get<Response>(
            "/api/getQuizzes"
        );
        return quizzes.data;
    }
}

export default new QuizService();
