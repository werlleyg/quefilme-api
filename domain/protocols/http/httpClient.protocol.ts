import { HttpStatusCodeEnum } from "../../enums/statusCode.enum";

export type HttpMethod = "post" | "get" | "put" | "delete";

export abstract class HttpRequest {
  url: string;
  method: HttpMethod;
  body?: any;
  headers?: any;
}

export abstract class HttpResponse<T = any> {
  statusCode: HttpStatusCodeEnum;
  body?: T;
}

export abstract class HttpClient<R = any> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>;
}
