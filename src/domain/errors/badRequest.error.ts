import { HttpStatusCodeEnum } from "../enums";
import { AppError } from "./base.error";

export class BadRequestError extends AppError {
  constructor() {
    super("Bad request!");
    this.message = "BadRequestError";
    this.statusCode = HttpStatusCodeEnum.badRequest;
  }
}
