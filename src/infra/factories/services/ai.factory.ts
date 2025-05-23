import { AiService } from "../../../domain/services/ai.service";
import { AppConfig } from "../../config";
import { AiServiceImpl } from "../../services/aiImpl.service";
import { makeAxiosHttpClient } from "../http/axiosHttpClient.factory";

export const makeAiService = (): AiService =>
  new AiServiceImpl(
    makeAxiosHttpClient(),
    AppConfig.BASE_URL_AI_SERVICE,
    AppConfig.AI_SERVICE_KEY,
  );
