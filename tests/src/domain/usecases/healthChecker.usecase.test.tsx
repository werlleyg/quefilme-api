import { HealthCheckerUsecaseImpl } from "../../../../src/domain/usecases/healthChecker.usecase";

describe("HealthCheckerUsecaseImpl", () => {
  let healthChecker: HealthCheckerUsecaseImpl;

  beforeEach(() => {
    healthChecker = new HealthCheckerUsecaseImpl();
  });

  it("should return the correct status message with the current date and time", async () => {
    // Mock Date
    const mockDate = new Date("2024-04-10T12:32:00Z");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 10, 2024 at 9 hours and 32 minutes",
    );
  });

  it("should handle single-digit minutes correctly", async () => {
    // Mock Date
    const mockDate = new Date("2024-04-10T12:05:00Z");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 10, 2024 at 9 hours and 5 minutes",
    );
  });

  it("should handle midnight correctly", async () => {
    // Mock Date
    const mockDate = new Date("2024-04-10T00:00:00Z");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 9, 2024 at 21 hours and 0 minutes",
    );
  });

  it("should handle noon correctly", async () => {
    // Mock Date
    const mockDate = new Date("2024-04-10T12:00:00Z");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const result = await healthChecker.exec();

    expect(result.status).toBe(
      "API is working on April 10, 2024 at 9 hours and 0 minutes",
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
