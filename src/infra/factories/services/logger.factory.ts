import { LoggerService } from "../../../domain/services";
import { AppConfig } from "../../config";
import { LoggerServiceImpl } from "../../services/loggerImpl.service";
import { makeAxiosHttpClient } from "../http/axiosHttpClient.factory";

export class LoggerServiceFactory {
  private static instance: LoggerService;

  public static getInstance(): LoggerService {
    if (!LoggerServiceFactory.instance) {
      LoggerServiceFactory.instance = new LoggerServiceImpl(
        makeAxiosHttpClient(),
        AppConfig.GRAFANA_URL,
        AppConfig.GRAFANA_API_KEY,
      );
    }
    return LoggerServiceFactory.instance;
  }
}

export const makeLoggerService = (): LoggerService =>
  LoggerServiceFactory.getInstance();
