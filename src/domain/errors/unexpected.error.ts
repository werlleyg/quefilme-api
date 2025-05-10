import { HttpStatusCodeEnum } from "../enums";
import { AppError } from "./base.error";

export class UnexpectedError extends AppError {
  constructor() {
    super("Unexpected error!");
    this.message = "UnexpectedError";
    this.statusCode = HttpStatusCodeEnum.serverError;
  }
}
