import { TranslatorService } from "../../../domain/services";
import { AppConfig } from "../../config";
import { TranslatorServiceImpl } from "../../services/translatorImpl.service";
import { makeAxiosHttpClient } from "../http/axiosHttpClient.factory";

export const makeTranslatorService = (): TranslatorService =>
  new TranslatorServiceImpl(
    makeAxiosHttpClient(),
    AppConfig.BASE_URL_TRANSLATOR,
    AppConfig.ACCESS_KEY_TRANSLATOR,
  );
