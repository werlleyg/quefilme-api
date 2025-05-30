export interface LoggerService {
  info: (
    description: string,
    params?: LoggerService.Params,
  ) => Promise<LoggerService.Model>;
  warn: (
    description: string,
    params?: LoggerService.Params,
  ) => Promise<LoggerService.Model>;
  error: (
    description: string,
    params?: LoggerService.Params,
  ) => Promise<LoggerService.Model>;

  setLabels: (labels: Object) => void;
}

export namespace LoggerService {
  export type Params = {
    metadata?: Object;
  };
  export type Model = any;

  export type Buffer = [string, string];
}
