import { HealthCheckerUsecase } from "./interfaces/healthChecker.interface";

export class HealthCheckerUsecaseImpl implements HealthCheckerUsecase {
  constructor() {}

  async exec(): Promise<HealthCheckerUsecase.Model> {
    const now = new Date();
    const message = `API is working on ${now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} at ${now.getHours()} hours and ${now.getMinutes()} minutes`;

    return { status: message };
  }
}
