/**
 * Custom error class for handling application-specific errors.
 */
export class AppError {
  /**
   * The error message that describes the nature of the error.
   */
  public message: string;
  /**
   * The HTTP status code associated with the error. Default is 400 (Bad Request).
   */
  public statusCode: number;

  /**
   * Creates an instance of the AppError class.
   *
   * @param {string} message - The error message that describes the nature of the error.
   * @param {number} statusCode - The HTTP status code associated with the error. Default is 400 (Bad Request).
   */
  constructor(message: string, statusCode: number = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
