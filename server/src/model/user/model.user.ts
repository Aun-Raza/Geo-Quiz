/* eslint-disable linebreak-style */
import mongoose, { Schema, model, ObjectId } from 'mongoose';

interface IUser {
  _id: ObjectId;
  username: string;
  hash: string;
  quizzes: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      minlength: 5,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    quizzes: {
      type: [mongoose.Types.ObjectId],
      ref: 'Quiz',
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUser>('User', UserSchema);
export { UserModel };
