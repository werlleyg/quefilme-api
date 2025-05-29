import { Request, Response, NextFunction } from "express";
import { makeLoggerService } from "../factories/services/logger.factory";
import { AppConfig } from "../config";

/**
 * Logger handling middleware function that intercepts and send logs to provider.
 *
 * @param {Request} request - The Express request object.
 * @param {Response} response - The Express response object.
 * @param {NextFunction} next - The Express next function to pass control to the next middleware.
 */
export function loggerInterceptor(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const loggerService = makeLoggerService();

  const labels = {
    app: AppConfig.APP_NAME,
    environment: AppConfig.NODE_ENV,
    method: request.method,
    path: request.baseUrl,
  };

  // set logger service labels
  loggerService.setLabels(labels);

  // send logger service metadata to provider
  response.on("finish", async () => await loggerService.send());

  next();
}
