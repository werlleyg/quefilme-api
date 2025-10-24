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

    expect(result.status).toBe("UP");
    expect(result.timestamp).toBe("2024-04-10T12:32:00.000Z");
    expect(result.uptime).toBeGreaterThanOrEqual(1);
    expect(result.environment).toBe("TEST");
  });

  it("should handle single-digit minutes correctly", async () => {
    // Mock Date
    const mockDate = new Date("2024-04-10T12:05:00Z");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const result = await healthChecker.exec();

    expect(result.status).toBe("UP");
    expect(result.timestamp).toBe("2024-04-10T12:05:00.000Z");
  });

  it("should handle midnight correctly", async () => {
    // Mock Date
    const mockDate = new Date("2024-04-10T00:00:00Z");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const result = await healthChecker.exec();

    expect(result.status).toBe("UP");
    expect(result.timestamp).toBe("2024-04-10T00:00:00.000Z");
  });

  it("should handle noon correctly", async () => {
    // Mock Date
    const mockDate = new Date("2024-04-10T12:00:00Z");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const result = await healthChecker.exec();

    expect(result.status).toBe("UP");
  });

  it("should return the correct version from package.json when available", async () => {
    // Mock process.env.npm_package_version
    const originalPackageVersion = process.env.npm_package_version;
    process.env.npm_package_version = "0.0.9";

    const result = await healthChecker.exec();

    expect(result.version).toBe("0.0.9");

    // Restore original value
    if (originalPackageVersion) {
      process.env.npm_package_version = originalPackageVersion;
    } else {
      delete process.env.npm_package_version;
    }
  });

  it("should return default version when npm_package_version is not available", async () => {
    // Mock process.env.npm_package_version as undefined
    const originalPackageVersion = process.env.npm_package_version;
    delete process.env.npm_package_version;

    const result = await healthChecker.exec();

    expect(result.version).toBe("1.0.0");

    // Restore original value
    if (originalPackageVersion) {
      process.env.npm_package_version = originalPackageVersion;
    }
  });

  it("should return the correct environment from NODE_ENV when available", async () => {
    // Mock process.env.NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "PRODUCTION";

    const result = await healthChecker.exec();

    expect(result.environment).toBe("PRODUCTION");

    // Restore original value
    if (originalNodeEnv) {
      process.env.NODE_ENV = originalNodeEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  it("should return default environment when NODE_ENV is not available", async () => {
    // Mock process.env.NODE_ENV as undefined
    const originalNodeEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    const result = await healthChecker.exec();

    expect(result.environment).toBe("DEV");

    // Restore original value
    if (originalNodeEnv) {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
