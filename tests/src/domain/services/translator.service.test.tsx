import { LanguagesEnum } from "../../../../src/domain/enums";
import { TranslatorService } from "../../../../src/domain/services";

describe("TranslatorService", () => {
  let translatorService: TranslatorService;

  beforeEach(() => {
    translatorService = {
      translator: jest.fn(),
    };
  });

  it("should translate a given text successfully", async () => {
    const params: TranslatorService.Params = {
      query: "Hello",
      target: LanguagesEnum.PTBR,
      source: LanguagesEnum.EN,
    };
    const mockResponse = "Olá";
    (translatorService.translator as jest.Mock).mockResolvedValue(mockResponse);

    const response = await translatorService.translator(params);

    expect(response).toBe(mockResponse);
    expect(translatorService.translator).toHaveBeenCalledWith(params);
  });

  it("should handle translation failure", async () => {
    const params: TranslatorService.Params = {
      query: "Hello",
      target: LanguagesEnum.PTBR,
      source: LanguagesEnum.EN,
    };
    (translatorService.translator as jest.Mock).mockRejectedValue(
      new Error("Translation error"),
    );

    await expect(translatorService.translator(params)).rejects.toThrow(
      "Translation error",
    );
  });

  it("should call translator with correct parameters", async () => {
    const params: TranslatorService.Params = {
      query: "Olá",
      target: LanguagesEnum.EN,
      source: LanguagesEnum.PTBR,
    };

    (translatorService.translator as jest.Mock).mockResolvedValue("Hello");
    await translatorService.translator(params);

    expect(translatorService.translator).toHaveBeenCalledWith(params);
    expect(translatorService.translator).toHaveBeenCalledTimes(1);
  });
});
