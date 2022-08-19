export interface IUser {
  _id: string;
  username: string;
  email: string;
}

export interface ILoginProps {
  username: string;
  password: string;
}
