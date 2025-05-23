import { HealthCheckerUsecaseImpl } from "../../../../src/domain/usecases/healthChecker.usecase";

describe("HealthCheckerUsecaseImpl", () => {
  let healthChecker: HealthCheckerUsecaseImpl;

  beforeEach(() => {
    healthChecker = new HealthCheckerUsecaseImpl();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the correct status message with the current date and time in UTC-0", async () => {
    const mockDate = new Date(Date.UTC(2024, 3, 10, 12, 32, 0)); // UTC-0
    jest.setSystemTime(mockDate);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 10, 2024 at 12 hours and 32 minutes",
    );
  });

  it("should handle single-digit minutes correctly in UTC-0", async () => {
    const mockDate = new Date(Date.UTC(2024, 3, 10, 12, 5, 0)); // UTC-0
    jest.setSystemTime(mockDate);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 10, 2024 at 12 hours and 5 minutes",
    );
  });

  it("should handle midnight correctly in UTC-0", async () => {
    const mockDate = new Date(Date.UTC(2024, 3, 10, 0, 0, 0)); // UTC-0
    jest.setSystemTime(mockDate);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 10, 2024 at 0 hours and 0 minutes",
    );
  });

  it("should handle noon correctly in UTC-0", async () => {
    const mockDate = new Date(Date.UTC(2024, 3, 10, 12, 0, 0)); // UTC-0
    jest.setSystemTime(mockDate);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 10, 2024 at 12 hours and 0 minutes",
    );
  });
});
