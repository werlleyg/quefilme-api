import { HttpStatusCodeEnum } from "../../../../src/domain/enums";
import { UnexpectedError } from "../../../../src/domain/errors";
import { AppError } from "../../../../src/domain/errors/base.error";

describe("UnexpectedError", () => {
  it("should create an instance of UnexpectedError", () => {
    const error = new UnexpectedError();

    expect(error).toBeInstanceOf(UnexpectedError);
  });

  it("should have the correct message", () => {
    const error = new UnexpectedError();

    expect(error.message).toBe("UnexpectedError");
  });

  it("should have the correct statusCode", () => {
    const error = new UnexpectedError();

    expect(error.statusCode).toBe(HttpStatusCodeEnum.serverError);
  });

  it("should inherit from AppError", () => {
    const error = new UnexpectedError();

    expect(error).toBeInstanceOf(AppError);
  });
});
