import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { ObjectId, Document } from 'mongoose';
import { UserModel } from '../../model/user/model.user';

interface IUser extends Document {
    _id: ObjectId;
    username: string;
}

class User {
    public static getSignedToken(doc: IUser) {
        const { _id, username } = doc;
        const payload = { _id, username };
        return jwt.sign(payload, config.get('JWT_PRIVATE_KEY'));
    }

    public static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, await bcrypt.genSalt());
    }

    public static async saveUser() {
        const user = new User();
        const hash = await User.hash(user.password);
        const doc = new UserModel(Object.assign(user, { hash }));
        await doc.save();
        return doc;
    }

    constructor(
        public email: string = 'johnDoe@gmail.com',
        public username: string = 'john doe',
        public password: string = 'password'
    ) {}

    public toString() {
        return {
            email: this.email,
            username: this.username,
            password: this.password,
        };
    }
}

export { User, IUser };
