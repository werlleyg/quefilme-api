import { HttpStatusCodeEnum } from "../enums";
import { AppError } from "./base.error";

export class UnexpectedError extends AppError {
  constructor(message?: string) {
    super("Unexpected error!");
    this.message = message ?? "UnexpectedError";
    this.statusCode = HttpStatusCodeEnum.serverError;
  }
}
