import Person from "./person.model";
import { Input } from "./form.model";

type Login = {
  username: string;
  password: string;
};

export type Register = Login & {
  confirmPassword: string;
  persons: (string | Person)[];
};

export type RegisterRq = Omit<Register, "confirmPassword" | "persons"> & {
  persons: Input<Person>[];
};

export default Login;
