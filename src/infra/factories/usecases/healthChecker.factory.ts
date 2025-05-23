import { HealthCheckerUsecaseImpl } from "../../../domain/usecases/healthChecker.usecase";
import { HealthCheckerUsecase } from "../../../domain/usecases/interfaces/healthChecker.interface";

export const makeHealthCheckerUsecase = (): HealthCheckerUsecase =>
  new HealthCheckerUsecaseImpl();
