import { AppConfig } from "../../../../../src/infra/config";
import { makeAxiosHttpClient } from "../../../../../src/infra/factories/http/axiosHttpClient.factory";
import { makeTranslatorService } from "../../../../../src/infra/factories/services/translator.factory";
import { TranslatorServiceImpl } from "../../../../../src/infra/services/translatorImpl.service";

jest.mock(
  "../../../../../src/infra/factories/http/axiosHttpClient.factory",
  () => ({
    makeAxiosHttpClient: jest.fn(),
  }),
);

jest.mock("../../../../../src/infra/config", () => ({
  AppConfig: {
    BASE_URL_TRANSLATOR: "http://mock-translator-url.com",
    ACCESS_KEY_TRANSLATOR: "mock-access-key",
  },
}));

describe("makeTranslatorService", () => {
  it("should return a TranslatorServiceImpl instance", () => {
    // Arrange
    const mockHttpClient = { get: jest.fn(), post: jest.fn() }; // Mock do cliente HTTP
    (makeAxiosHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

    // Act
    const translatorService = makeTranslatorService();

    // Assert
    expect(translatorService).toBeInstanceOf(TranslatorServiceImpl);
  });

  it("should pass the correct params to TranslatorServiceImpl constructor", () => {
    // Arrange
    const mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      request: jest.fn(),
    };
    (makeAxiosHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

    // Act
    const translatorService = makeTranslatorService();

    // Assert
    expect(makeAxiosHttpClient).toHaveBeenCalled();
    expect(translatorService).toEqual(
      new TranslatorServiceImpl(
        mockHttpClient,
        AppConfig.BASE_URL_TRANSLATOR,
        AppConfig.ACCESS_KEY_TRANSLATOR,
      ),
    );
  });
});
