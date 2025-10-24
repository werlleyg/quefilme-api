import { HttpClient } from "../../domain/protocols/http";
import { AiServiceMapper } from "../mappers/ai-service.mapper";
import { ResponseHandler } from "../shared/responseHandler.shared";
import { AiService } from "./../../domain/services";

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
      model: "deepseek/deepseek-v3.2-exp",
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

      const output = ResponseHandler(httpResponse);

      return await AiServiceMapper.toMoviePattern(output);
    } catch (e) {
      console.log(`Ai service error: ${e}`);

      throw Error(e);
    }
  }
}
