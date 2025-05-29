import { Request, Response } from "express";
import { makeHealthCheckerUsecase } from "../../infra/factories/usecases/healthChecker.factory";
import { ControllerLogger } from "../decorators/logger.decorator";

export class HealthCheckerController {
  /**
   * Check Health
   * @param {Request} _ .
   * @param {Response} response - The Express response object to send the health check.
   */
  @ControllerLogger()
  public async healthChecker(_: Request, response: Response) {
    const res = await makeHealthCheckerUsecase().exec();

    return response.status(200).json(res);
  }
}
