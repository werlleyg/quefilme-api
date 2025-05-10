import { HttpStatusCodeEnum } from "../enums";
import { AppError } from "./base.error";

export class AccessDeniedError extends AppError {
  constructor() {
    super("Access denied!");
    this.message = "AccessDeniedError";
    this.statusCode = HttpStatusCodeEnum.unauthorized;
  }
}
