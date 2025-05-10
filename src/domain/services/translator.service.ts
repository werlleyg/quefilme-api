import { LanguagesEnum } from "../enums";

export interface TranslatorService {
  translator: (
    params: TranslatorService.Params,
  ) => Promise<TranslatorService.Model>;
}

export namespace TranslatorService {
  export type Params = {
    query: string;
    target: LanguagesEnum;
    source: LanguagesEnum;
  };
  export type Model = any;
}
