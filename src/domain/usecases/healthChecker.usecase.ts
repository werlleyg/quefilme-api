import { HealthCheckerUsecase } from "./interfaces/healthChecker.interface";

export class HealthCheckerUsecaseImpl implements HealthCheckerUsecase {
  constructor() {}

  async exec(): Promise<HealthCheckerUsecase.Model> {
    const output = {
      status: "UP" as const,
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime() * 100) / 100,
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "DEV",
    };

    return output;
  }
}
