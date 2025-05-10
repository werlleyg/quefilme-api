import { HttpStatusCodeEnum } from "../../../../src/domain/enums";
import { NotFoundError } from "../../../../src/domain/errors";
import { AppError } from "../../../../src/domain/errors/base.error";

describe("NotFoundError", () => {
  it("should create an instance of NotFoundError", () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(NotFoundError);
  });

  it("should have the correct message", () => {
    const error = new NotFoundError();

    expect(error.message).toBe("NotFoundError");
  });

  it("should have the correct statusCode", () => {
    const error = new NotFoundError();

    expect(error.statusCode).toBe(HttpStatusCodeEnum.notFound);
  });

  it("should inherit from AppError", () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(AppError);
  });
});
