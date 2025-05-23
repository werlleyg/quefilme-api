import { HttpStatusCodeEnum } from "../../../../src/domain/enums";
import { BadRequestError } from "../../../../src/domain/errors/badRequest.error";
import { AppError } from "../../../../src/domain/errors/base.error";

describe("BadRequestError", () => {
  it("should be an instance of BadRequestError", () => {
    const error = new BadRequestError();
    expect(error).toBeInstanceOf(BadRequestError);
  });

  it("should extend AppError", () => {
    const error = new BadRequestError();
    expect(error).toBeInstanceOf(AppError);
  });

  it("should have the correct message", () => {
    const error = new BadRequestError();
    expect(error.message).toBe("BadRequestError");
  });

  it("should have the correct status code", () => {
    const error = new BadRequestError();
    expect(error.statusCode).toBe(HttpStatusCodeEnum.badRequest);
  });

  it("should have a default message of 'BadRequestError'", () => {
    const error = new BadRequestError();
    expect(error.message).toBe("BadRequestError");
  });
});
