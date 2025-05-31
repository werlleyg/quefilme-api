import { Request, Response } from "express";

export namespace ControllerLoggerPresenter {
  export type MetadataReturn = {
    controller: string;
    method: string;
    path: string;
    statusCode?: number;
    executionTime?: number;
    timestamp: string;
    event: string;
    userId?: string;
    userAgent?: string;
    ip?: string;
    requestBody?: any;
    requestParams?: any;
    requestQuery?: any;
    error?: any;
  };
}

export class ControllerLoggerPresenter {
  static metadata(
    args: any,
    target: any,
    propertyKey: string,
    event: string,
  ): ControllerLoggerPresenter.MetadataReturn {
    const [req, _res] = args as [Request, Response];

    const metadata: ControllerLoggerPresenter.MetadataReturn = {
      controller: target.constructor.name,
      method: propertyKey,
      path: req.baseUrl,
      timestamp: new Date().toISOString(),
      userId: req.headers["x-user-id"]?.toString(),
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      requestBody: req.body,
      requestParams: req.params,
      requestQuery: req.query,
      event: event,
    };

    return metadata;
  }
}
