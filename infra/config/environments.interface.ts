import { NodeEnvEnum } from "./environment.enum";

export interface IConfig {
  NODE_ENV: NodeEnvEnum;
  PORT: number;
}
