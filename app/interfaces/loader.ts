export interface ResponseAction<T = unknown> {
  status: number;
  data: T;
}
