import { ControllerLoggerPresenter } from "../../infra/presenters/controllerLogger.presenter";
import { makeLoggerService } from "../../infra/factories/services/logger.factory";

export function ControllerLogger() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) =>
      await _handleWithController(args, target, propertyKey, originalMethod);

    return descriptor;
  };

  async function _handleWithController(
    args: any[],
    target: any,
    propertyKey: string,
    originalMethod: any,
  ) {
    const startTime = Date.now();

    let metadata = ControllerLoggerPresenter.metadata(
      args,
      target,
      propertyKey,
      "REQUEST_STARTED",
    );

    try {
      await _sendLogger(metadata);

      const result = await originalMethod.apply(this, args);
      metadata = _successMetadata(
        metadata,
        startTime,
        result?.status || result?.statusCode,
      );
      await _sendLogger(metadata);

      return result;
    } catch (error) {
      metadata = _errorMetadata(metadata, startTime, error);
      await _sendLogger(metadata, "error");
      throw error;
    }
  }

  async function _sendLogger(
    metadata: ControllerLoggerPresenter.MetadataReturn,
    type: "info" | "error" = "info",
  ) {
    makeLoggerService()[type](metadata.event, { metadata });
  }

  function _successMetadata(
    metadata: ControllerLoggerPresenter.MetadataReturn,
    startTime: number,
    statusCode: number = 200,
  ): ControllerLoggerPresenter.MetadataReturn {
    metadata.executionTime = Date.now() - startTime;
    metadata.statusCode = statusCode;
    metadata.event = "REQUEST_COMPLETED";

    return metadata;
  }

  function _errorMetadata(
    metadata: ControllerLoggerPresenter.MetadataReturn,
    startTime: number,
    error: any,
  ): ControllerLoggerPresenter.MetadataReturn {
    metadata.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    metadata.statusCode = error?.statusCode ?? error?.status ?? 500;
    metadata.executionTime = Date.now() - startTime;
    metadata.event = "REQUEST_ERROR";

    return metadata;
  }
}
