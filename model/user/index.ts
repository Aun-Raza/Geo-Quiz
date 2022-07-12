import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';

interface User {
	email: string;
	username: string;
	salt: string;
	hash: string;
}

const UserSchema = new Schema<User>(
	{
		email: {
			type: String,
			minlength: 5,
			required: true,
		},
		username: {
			type: String,
			minlength: 5,
			required: true,
		},
		salt: {
			type: String,
			required: true,
		},
		hash: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

UserSchema.method('getAccessToken', function (): string {
	return jwt.sign({ username: this.username }, process.env.TOKEN_SECRET, {
		expiresIn: 1800,
	});
});

const UserModel = model('User', UserSchema);
export { UserModel };
