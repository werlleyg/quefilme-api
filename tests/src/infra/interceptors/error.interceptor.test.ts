import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { AppError } from "../../../../src/domain/errors/base.error";
import { errorInterceptor } from "../../../../src/infra/interceptors/error.interceptor";

describe("errorInterceptor ", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  it("should handle AppError and return the correct response", () => {
    const appError = new AppError(
      "App-specific error",
      400,
    ) as unknown as Error;

    errorInterceptor(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "Error",
      message: "App-specific error",
    });
  });

  it("should handle ZodError and return the correct response", () => {
    const zodError = new ZodError([
      {
        path: ["field"],
        message: "Invalid field",
        code: "invalid_type",
        expected: "string",
        received: "number",
      },
    ]) as ZodError;

    errorInterceptor(
      zodError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "Validation error",
      message: zodError.issues,
    });
  });

  it("should handle generic errors and return a 500 response", () => {
    const genericError = new Error("Generic error");

    errorInterceptor(
      genericError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "Error",
      message: "Internal Server Error",
    });
  });
});
