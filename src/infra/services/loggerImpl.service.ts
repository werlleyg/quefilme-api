import { LoggerTypeEnum } from "../../domain/enums";
import { HttpClient } from "../../domain/protocols/http";
import { LoggerService } from "../../domain/services";
import { AppConfig, NodeEnvEnum } from "../config";
import { ResponseHandler } from "../shared/responseHandler.shared";

export class LoggerServiceImpl implements LoggerService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  // buffer to store logs temporarily
  private _logsBuffer: LoggerService.Buffer[] = [];

  private _labels: Object = {};

  info = async (
    description: string,
    params?: LoggerService.Params,
  ): Promise<LoggerService.Model> =>
    this._addLog(
      this._formatLogger({ description, type: LoggerTypeEnum.INFO, ...params }),
    );

  warn = async (
    description: string,
    params?: LoggerService.Params,
  ): Promise<LoggerService.Model> =>
    this._addLog(
      this._formatLogger({ description, type: LoggerTypeEnum.WARN, ...params }),
    );

  error = async (
    description: string,
    params?: LoggerService.Params,
  ): Promise<LoggerService.Model> =>
    this._addLog(
      this._formatLogger({
        description,
        type: LoggerTypeEnum.ERROR,
        ...params,
      }),
    );

  setLabels = (labels: Object): void => {
    this._labels = labels;
  };

  _formatLogger({
    description,
    type,
    metadata,
  }: LoggerService.Params & {
    description: string;
    type: LoggerTypeEnum;
  }): LoggerService.Buffer {
    const auxMetadata = {
      description,
      type,
      ...(metadata || {}),
    };

    return [
      (Math.floor(Date.now() / 1000) * 1000000000).toString(),
      JSON.stringify(auxMetadata),
    ] as LoggerService.Buffer;
  }

  private _addLog = (log: LoggerService.Buffer) => {
    this._logsBuffer.push(log);
    this._send(log);
  };

  async _send(log: LoggerService.Buffer): Promise<LoggerService.Model> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const body = {
      streams: [
        {
          stream: this._labels,
          values: [log],
        },
      ],
    };

    console.info(JSON.stringify(body, null, 2));

    if (AppConfig.NODE_ENV !== NodeEnvEnum.PROD) {
      return;
    }

    let shouldClearBuffer = false;

    try {
      const httpResponse = await this.httpClient.request({
        url: this.baseUrl,
        method: "post",
        body,
        headers,
      });

      ResponseHandler(httpResponse);
      shouldClearBuffer = true;
    } catch (error) {
      console.error("Error sending logs:", error);
      throw new Error("Failed to send logs to the logging service.", {
        cause: error,
      });
    } finally {
      if (shouldClearBuffer) {
        this._logsBuffer = [];
      }
    } // Clear the buffer after sending logs
  }
}
