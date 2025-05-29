import { NodeEnvEnum } from "./environment.enum";

export interface IConfig {
  NODE_ENV: NodeEnvEnum;
  PORT: number;
  BASE_URL_MOVIES_SERVICE: string;
  ACCESS_KEY_MOVIES_SERVICE: string;
  BASE_URL_AI_SERVICE: string;
  BASE_URL_TRANSLATOR: string;
  ACCESS_KEY_TRANSLATOR: string;
  AI_SERVICE_KEY: string;
  APP_NAME: string;
  GRAFANA_URL: string;
  GRAFANA_API_KEY: string;
}
