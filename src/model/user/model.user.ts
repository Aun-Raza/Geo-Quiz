import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";

interface User {
  email: string;
  username: string;
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
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// TODO:
// UserSchema.method("getSignedToken", function () {
//   return jwt.sign({ username: this.username }, config.get("JWT_PRIVATE_KEY"), {
//     expiresIn: 1800,
//   });
// });

const UserModel = model("User", UserSchema);
export { UserModel };
