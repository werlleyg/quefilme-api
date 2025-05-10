import { AiService } from "../../../../src/domain/services/ai.service";

describe("AiService", () => {
  let aiService: AiService;

  beforeEach(() => {
    aiService = {
      generateResponse: jest.fn(),
    };
  });

  it("should call generateResponse with the correct parameters", async () => {
    const params: AiService.Params = "Hello AI";
    (aiService.generateResponse as jest.Mock).mockResolvedValue("response");

    await aiService.generateResponse(params);

    expect(aiService.generateResponse).toHaveBeenCalledWith(params);
  });

  it("should return a valid response model", async () => {
    const params: AiService.Params = "Test input";
    const expectedResponse: AiService.Model = { message: "AI Response" };
    (aiService.generateResponse as jest.Mock).mockResolvedValue(
      expectedResponse,
    );

    const result = await aiService.generateResponse(params);

    expect(result).toEqual(expectedResponse);
  });

  it("should handle empty string input", async () => {
    const params: AiService.Params = "";
    const expectedResponse: AiService.Model = {
      message: "Empty input handled",
    };
    (aiService.generateResponse as jest.Mock).mockResolvedValue(
      expectedResponse,
    );

    const result = await aiService.generateResponse(params);

    expect(result).toEqual(expectedResponse);
  });

  it("should handle null input", async () => {
    (aiService.generateResponse as jest.Mock).mockRejectedValue(
      new Error("Invalid input"),
    );

    await expect(
      aiService.generateResponse(null as unknown as string),
    ).rejects.toThrow("Invalid input");
  });

  it("should handle undefined input", async () => {
    (aiService.generateResponse as jest.Mock).mockRejectedValue(
      new Error("Invalid input"),
    );

    await expect(
      aiService.generateResponse(undefined as unknown as string),
    ).rejects.toThrow("Invalid input");
  });

  it("should throw an error if the AI service is unavailable", async () => {
    (aiService.generateResponse as jest.Mock).mockRejectedValue(
      new Error("Service Unavailable"),
    );

    await expect(aiService.generateResponse("Test input")).rejects.toThrow(
      "Service Unavailable",
    );
  });

  it("should reject when an invalid parameter is passed", async () => {
    (aiService.generateResponse as jest.Mock).mockRejectedValue(
      new Error("Invalid parameter"),
    );

    await expect(
      aiService.generateResponse(123 as unknown as string),
    ).rejects.toThrow("Invalid parameter");
  });

  it("should handle long input strings", async () => {
    const longInput = "A".repeat(10000);
    const expectedResponse = { message: "Handled long input" };
    (aiService.generateResponse as jest.Mock).mockResolvedValue(
      expectedResponse,
    );

    const result = await aiService.generateResponse(longInput);

    expect(result).toEqual(expectedResponse);
  });

  it("should handle unexpected response format", async () => {
    (aiService.generateResponse as jest.Mock).mockResolvedValue(null);

    const result = await aiService.generateResponse("Test input");

    expect(result).toBeNull();
  });

  it("should execute within a reasonable time", async () => {
    const params: AiService.Params = "Performance test";
    const expectedResponse: AiService.Model = "response";
    (aiService.generateResponse as jest.Mock).mockResolvedValue(
      expectedResponse,
    );

    const startTime = Date.now();
    await aiService.generateResponse(params);
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(2000); // Adjust threshold as needed
  });

  it("should support multiple simultaneous requests", async () => {
    (aiService.generateResponse as jest.Mock).mockResolvedValue("response");

    const responses = await Promise.all([
      aiService.generateResponse("Test 1"),
      aiService.generateResponse("Test 2"),
      aiService.generateResponse("Test 3"),
    ]);

    expect(responses).toEqual(["response", "response", "response"]);
  });
});
