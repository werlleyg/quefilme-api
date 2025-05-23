import { HttpStatusCodeEnum } from "../../../../src/domain/enums";
import { AccessDeniedError } from "../../../../src/domain/errors/accessDenied.error";
import { AppError } from "../../../../src/domain/errors/base.error";

describe("AccessDeniedError", () => {
  it("should be an instance of AccessDeniedError", () => {
    const error = new AccessDeniedError();
    expect(error).toBeInstanceOf(AccessDeniedError);
  });

  it("should extend AppError", () => {
    const error = new AccessDeniedError();
    expect(error).toBeInstanceOf(AppError);
  });

  it("should have the correct message", () => {
    const error = new AccessDeniedError();
    expect(error.message).toBe("AccessDeniedError");
  });

  it("should have the correct status code", () => {
    const error = new AccessDeniedError();
    expect(error.statusCode).toBe(HttpStatusCodeEnum.unauthorized);
  });

  it("should have a default message of 'AccessDeniedError'", () => {
    const error = new AccessDeniedError();
    expect(error.message).toBe("AccessDeniedError");
  });
});
