import { HttpStatusCodeEnum } from "../../../../src/domain/enums";
import {
  BadRequestError,
  NotFoundError,
  UnexpectedError,
} from "../../../../src/domain/errors";
import { HttpResponse } from "../../../../src/domain/protocols/http";
import { ResponseHandler } from "../../../../src/infra/shared/responseHandler.shared";

describe("ResponseHandler", () => {
  it("should return the body when statusCode is HttpStatusCodeEnum.ok", () => {
    const httpResponse: HttpResponse = {
      statusCode: HttpStatusCodeEnum.ok,
      body: { message: "Success" },
    };

    const result = ResponseHandler(httpResponse);

    expect(result).toEqual(httpResponse.body);
  });

  it("should return the body when statusCode is HttpStatusCodeEnum.noContent", () => {
    const httpResponse: HttpResponse = {
      statusCode: HttpStatusCodeEnum.noContent,
      body: {},
    };

    const result = ResponseHandler(httpResponse);

    expect(result).toEqual(httpResponse.body);
  });

  it("should throw NotFoundError when statusCode is HttpStatusCodeEnum.notFound", () => {
    const httpResponse: HttpResponse = {
      statusCode: HttpStatusCodeEnum.notFound,
      body: null,
    };

    expect(() => ResponseHandler(httpResponse)).toThrow(NotFoundError);
  });

  it("should throw BadRequestError when statusCode is HttpStatusCodeEnum.badRequest", () => {
    const httpResponse: HttpResponse = {
      statusCode: HttpStatusCodeEnum.badRequest,
      body: null,
    };

    expect(() => ResponseHandler(httpResponse)).toThrow(BadRequestError);
  });

  it("should throw UnexpectedError for any other statusCode", () => {
    const httpResponse: HttpResponse = {
      statusCode: 999 as HttpStatusCodeEnum, // Unexpected status code
      body: null,
    };

    expect(() => ResponseHandler(httpResponse)).toThrow(UnexpectedError);
  });
});
