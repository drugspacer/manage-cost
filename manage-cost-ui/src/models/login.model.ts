type Login = {
  login: string;
  password: string;
  rememberMe: boolean;
};

export type Register = Login & { confirmPassword: string; persons: string[] };

export default Login;
