import axios from "axios";
import { loginProps, User } from "../interfaces/User";

class UserService {
    http = axios.create({
        baseURL: "http://localhost:8000",
    });

    async loginUser({ username, password }: loginProps) {
        try {
            const response = await this.http.post<User>("/api/loginUser", {
                username,
                password,
            });
            return response;
        } catch (ex: any) {
            console.log(ex);
        }
    }
}

export default new UserService();
