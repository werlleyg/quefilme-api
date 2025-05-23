import { HttpClient } from "../../domain/protocols/http";
import { TranslatorService } from "../../domain/services";
import { ResponseHandler } from "../shared/responseHandler.shared";

export class TranslatorServiceImpl implements TranslatorService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl: string,
    private readonly key: string,
  ) {}

  async translator(
    params: TranslatorService.Params,
  ): Promise<TranslatorService.Model> {
    const body = {
      ...params,
      q: params.query,
    };

    const httpResponse = await this.httpClient.request({
      url: `${this.baseUrl}/language/translate/v2?key=${this.key}`,
      method: "post",
      body,
    });

    return ResponseHandler(httpResponse);
  }
}
