import {
  HttpClient,
  HttpResponse,
} from "../../../../src/domain/protocols/http";
import { AiServiceImpl } from "../../../../src/infra/services/aiImpl.service";
import { ResponseHandler } from "../../../../src/infra/shared/responseHandler.shared";

jest.mock("../../../../src/infra/shared/responseHandler.shared");

describe("AiServiceImpl", () => {
  const mockHttpClient: jest.Mocked<HttpClient> = {
    request: jest.fn(),
  };

  const baseUrl = "https://api.example.com";
  const apiKey = "test-api-key";
  const aiService = new AiServiceImpl(mockHttpClient, baseUrl, apiKey);

  const prompt = "Test prompt";
  const mockResponse: HttpResponse = {
    statusCode: 200,
    body: { data: "mocked response" },
  };
  const mockProcessedResponse = {
    id: "gen-1761263336-XVL9fM3rErjY0I4XMuIq",
    provider: "DeepInfra",
    model: "deepseek/deepseek-v3.2-exp",
    object: "chat.completion",
    created: 1761263336,
    choices: [
      {
        logprobs: null,
        finish_reason: "stop",
        native_finish_reason: "stop",
        index: 0,
        message: {
          role: "assistant",
          content: "Yu-Gi-Oh! - tt0249516",
          refusal: null,
          reasoning: null,
        },
      },
    ],
    usage: {
      prompt_tokens: 116,
      completion_tokens: 12,
      total_tokens: 128,
      prompt_tokens_details: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send a request with the correct structure and return the processed response", async () => {
    mockHttpClient.request.mockResolvedValueOnce(mockResponse);
    (ResponseHandler as jest.Mock).mockReturnValueOnce(mockProcessedResponse);

    const result = await aiService.generateResponse(prompt);

    expect(mockHttpClient.request).toHaveBeenCalledWith({
      url: baseUrl,
      method: "post",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "deepseek/deepseek-v3.2-exp",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });

    expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
    expect(result).toBe("Yu-Gi-Oh! - tt0249516");
  });

  it("should throw an error if the httpClient request fails", async () => {
    const error = new Error("Request failed");
    mockHttpClient.request.mockRejectedValueOnce(error);

    await expect(aiService.generateResponse(prompt)).rejects.toThrow(
      error.message,
    );

    expect(mockHttpClient.request).toHaveBeenCalledWith({
      url: baseUrl,
      method: "post",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "deepseek/deepseek-v3.2-exp",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });
  });

  it("should log an error message when an exception occurs", async () => {
    const error = new Error("Request failed");
    mockHttpClient.request.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await expect(aiService.generateResponse(prompt)).rejects.toThrow(
      error.message,
    );

    expect(consoleSpy).toHaveBeenCalledWith(`Ai service error: ${error}`);
    consoleSpy.mockRestore();
  });
});
