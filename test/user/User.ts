import bcrypt from "bcrypt";

export default class User {
    public static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, await bcrypt.genSalt());
    }

    constructor(
        public email: string = "johnDoe@gmail.com",
        public username: string = "John Doe",
        public password: string = "password"
    ) {}

    public toString() {
        return {
            email: this.email,
            username: this.username,
            password: this.password,
        };
    }
}
