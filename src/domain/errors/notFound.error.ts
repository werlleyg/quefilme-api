import { HttpStatusCodeEnum } from "../enums";
import { AppError } from "./base.error";

export class NotFoundError extends AppError {
  constructor() {
    super("Not found!");
    this.message = "NotFoundError";
    this.statusCode = HttpStatusCodeEnum.notFound;
  }
}
