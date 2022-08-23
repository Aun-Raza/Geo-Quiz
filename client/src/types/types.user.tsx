export type LoginProps = {
  username: string;
  password: string;
};
export interface LoginFormProps {
  loginUser: ({ username, password }: LoginProps) => void;
}

export type UserProps = {
  _id: string;
  username: string;
  email: string;
};

export type NavBarProps = {
  user: UserProps | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserProps | undefined>>;
};
