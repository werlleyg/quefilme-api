import { HttpStatusCodeEnum } from "../../domain/enums";
import {
  BadRequestError,
  NotFoundError,
  UnexpectedError,
} from "../../domain/errors";
import { HttpResponse } from "../../domain/protocols/http";

export const ResponseHandler = (httpResponse: HttpResponse) => {
  switch (httpResponse.statusCode) {
    case HttpStatusCodeEnum.ok: {
      return httpResponse.body;
    }
    case HttpStatusCodeEnum.noContent: {
      return httpResponse.body;
    }
    case HttpStatusCodeEnum.notFound:
      throw new NotFoundError();
    case HttpStatusCodeEnum.badRequest:
      throw new BadRequestError();
    default:
      throw new UnexpectedError();
  }
};
