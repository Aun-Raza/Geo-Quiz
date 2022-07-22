import { Schema, model, ObjectId } from "mongoose";

interface IUser {
    _id: ObjectId;
    email: string;
    username: string;
    hash: string;
}

const UserSchema = new Schema<IUser>(
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
        hash: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const UserModel = model<IUser>("User", UserSchema);
export { UserModel };
