import { HttpClient } from "../../domain/protocols/http";
import { ResponseHandler } from "../shared/responseHandler.shared";
import { AiService } from "./../../domain/services/ai.service";

export class AiServiceImpl implements AiService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async generateResponse(prompt: AiService.Params): Promise<AiService.Model> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const body = {
      model: "deepseek/deepseek-r1-zero:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    try {
      const httpResponse = await this.httpClient.request({
        url: this.baseUrl,
        method: "post",
        body,
        headers,
      });

      return ResponseHandler(httpResponse);
    } catch (e) {
      console.log(`Ai service error: ${e}`);

      throw Error(e);
    }
  }
}
