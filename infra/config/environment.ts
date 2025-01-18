import path from "path";
import dotenv from "dotenv";
import { z } from "zod";
import { NodeEnvEnum } from "./environment.enum";
import { IConfig } from "./environments.interface";

const loadEnvConfig = (): void => {
  const envFile = process.env.NODE_ENV === "PROD" ? ".env" : ".env.local";
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
};

loadEnvConfig();

const envSchema = z.object({
  NODE_ENV: z
    .enum([NodeEnvEnum.DEV, NodeEnvEnum.PROD, NodeEnvEnum.TEST])
    .default(NodeEnvEnum.PROD),
  PORT: z
    .string()
    .regex(/^\d+$/, { message: "PORT must be a number" })
    .transform(Number),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.error) {
  console.error("Environment variable error:", parsedEnv.error.format());
  process.exit(1);
}

export const AppConfig: IConfig = parsedEnv.data;
