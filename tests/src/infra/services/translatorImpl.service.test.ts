import {
  HttpClient,
  HttpResponse,
} from "../../../../src/domain/protocols/http";
import { TranslatorService } from "../../../../src/domain/services";
import { TranslatorServiceImpl } from "../../../../src/infra/services/translatorImpl.service";
import { ResponseHandler } from "../../../../src/infra/shared/responseHandler.shared";

jest.mock("../../../../src/infra/shared/responseHandler.shared");
describe("TranslatorServiceImpl", () => {
  const mockHttpClient: jest.Mocked<HttpClient> = {
    request: jest.fn(),
  };

  const baseUrl = "https://api.example.com";
  const apiKey = "test-api-key";
  const translatorService = new TranslatorServiceImpl(
    mockHttpClient,
    baseUrl,
    apiKey,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("translator", () => {
    const params: TranslatorService.Params = {
      query: "Hello",
      source: "en" as any,
      target: "es" as any,
    };

    const mockResponse: HttpResponse = {
      statusCode: 200,
      body: { data: "mocked response" },
    };

    it("should send a request with the correct structure and return the processed response", async () => {
      mockHttpClient.request.mockResolvedValueOnce(mockResponse);
      (ResponseHandler as jest.Mock).mockReturnValueOnce("processed response");

      const result = await translatorService.translator(params);

      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: `${baseUrl}/language/translate/v2?key=${apiKey}`,
        method: "post",
        body: {
          ...params,
          q: params.query,
        },
      });
      expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
      expect(result).toBe("processed response");
    });

    it("should throw an error if the httpClient request fails", async () => {
      const error = new Error("Request failed");
      mockHttpClient.request.mockRejectedValueOnce(error);

      await expect(translatorService.translator(params)).rejects.toThrow(
        error.message,
      );

      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: `${baseUrl}/language/translate/v2?key=${apiKey}`,
        method: "post",
        body: {
          ...params,
          q: params.query,
        },
      });
    });

    it("should handle edge cases with invalid parameters", async () => {
      const invalidParams: TranslatorService.Params = {
        query: "",
        source: "" as any,
        target: "" as any,
      };

      mockHttpClient.request.mockResolvedValueOnce(mockResponse);
      (ResponseHandler as jest.Mock).mockReturnValueOnce("processed response");

      const result = await translatorService.translator(invalidParams);

      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: `${baseUrl}/language/translate/v2?key=${apiKey}`,
        method: "post",
        body: {
          ...invalidParams,
          q: invalidParams.query,
        },
      });
      expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
      expect(result).toBe("processed response");
    });
  });
});
