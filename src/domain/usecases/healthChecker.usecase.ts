import { HealthCheckerUsecase } from "./interfaces/healthChecker.interface";

export class HealthCheckerUsecaseImpl implements HealthCheckerUsecase {
  constructor() {}

  async exec(): Promise<HealthCheckerUsecase.Model> {
    const now = new Date();

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

    const formattedDate = dateFormatter.format(now);
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();

    const message = `API is working on ${formattedDate} at ${hours} hours and ${minutes} minutes`;

    return { status: message };
  }
}
