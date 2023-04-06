import { AxiosRequestConfig } from "axios";

interface ErrorRs {
  message: string;
  timestamp: string;
  path: string;
  exception: string;
  validationMessages?: Record<string, string>;
}

export type AxiosRequest<Rq = undefined> = AxiosRequestConfig<Rq> & {
  jwtAuth?: boolean;
};

export default ErrorRs;

export interface MessageRs<D> {
  message?: string;
  data: D;
}
