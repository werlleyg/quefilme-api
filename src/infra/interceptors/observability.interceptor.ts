import { Request, Response, NextFunction } from "express";
import { makeLoggerService } from "../factories/services/logger.factory";
import { AppConfig } from "../config";
import { v4 as uuidV4 } from "uuid";

/**
 * Observability handling interceptor function that intercepts and send logs and traces to provider.
 *
 * @param {Request} request - The Express request object.
 * @param {Response} response - The Express response object. [Not used yet]
 * @param {NextFunction} next - The Express next function to pass control to the next middleware.
 */
export function observabilityInterceptor(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const loggerService = makeLoggerService();

  const labels = {
    app: AppConfig.APP_NAME,
    environment: AppConfig.NODE_ENV,
    method: request.method,
    path: request.baseUrl,
    requestId: request.headers["x-request-id"] || uuidV4(),
  };

  // set logger service labels
  loggerService.setLabels(labels);

  next();
}
