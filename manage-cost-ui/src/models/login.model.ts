import Person from "./person.model";

type Login = {
  username: string;
  password: string;
};

export type Register = Login & {
  confirmPassword: string;
  persons: Person[];
};

export default Login;
