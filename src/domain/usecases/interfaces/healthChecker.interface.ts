export interface HealthCheckerUsecase {
  exec: () => Promise<HealthCheckerUsecase.Model>;
}

export namespace HealthCheckerUsecase {
  export type Model = {
    status: string;
    timestamp?: string;
    uptime?: number;
    version?: string;
    environment?: string;
  };
}
