import { makeHealthCheckerUsecase } from "../../../../../src/infra/factories/usecases/healthChecker.factory";
import { HealthCheckerUsecaseImpl } from "../../../../../src/domain/usecases/healthChecker.usecase";

describe("HealthCheckerUsecase Factory", () => {
  it("should create an instance of HealthCheckerUsecaseImpl", () => {
    const usecase = makeHealthCheckerUsecase();

    expect(usecase).toBeInstanceOf(HealthCheckerUsecaseImpl);
  });

  it("should return a valid HealthCheckerUsecase instance", () => {
    const usecase = makeHealthCheckerUsecase();

    expect(usecase).toHaveProperty("exec");
    expect(typeof usecase.exec).toBe("function");
  });
});
