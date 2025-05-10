import {
  HttpClient,
  HttpResponse,
} from "../../../../src/domain/protocols/http";
import { MoviesServiceImpl } from "../../../../src/infra/services/moviesImpl.service";
import { ResponseHandler } from "../../../../src/infra/shared/responseHandler.shared";

jest.mock("../../../../src/infra/shared/responseHandler.shared");

describe("MoviesServiceImpl", () => {
  const mockHttpClient: jest.Mocked<HttpClient> = {
    request: jest.fn(),
  };

  const baseUrl = "https://api.example.com";
  const accessKey = "test-access-key";
  const moviesService = new MoviesServiceImpl(
    mockHttpClient,
    baseUrl,
    accessKey,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOne", () => {
    const imdbID = "tt1234567";
    const mockResponse: HttpResponse = {
      statusCode: 200,
      body: { data: "mocked response" },
    };

    it("should send a request with the correct structure and return the processed response", async () => {
      mockHttpClient.request.mockResolvedValueOnce(mockResponse);
      (ResponseHandler as jest.Mock).mockReturnValueOnce("processed response");

      const result = await moviesService.getOne(imdbID);

      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: `${baseUrl}?i=${imdbID}&apikey=${accessKey}`,
        method: "get",
      });
      expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
      expect(result).toBe("processed response");
    });

    it("should throw an error if the httpClient request fails", async () => {
      const error = new Error("Request failed");
      mockHttpClient.request.mockRejectedValueOnce(error);

      await expect(moviesService.getOne(imdbID)).rejects.toThrow(error.message);

      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: `${baseUrl}?i=${imdbID}&apikey=${accessKey}`,
        method: "get",
      });
    });
  });

  describe("getList", () => {
    const title = "Inception";
    const mockResponse: HttpResponse = {
      statusCode: 200,
      body: { data: "mocked response" },
    };

    it("should send a request with the correct structure and return the processed response", async () => {
      mockHttpClient.request.mockResolvedValueOnce(mockResponse);
      (ResponseHandler as jest.Mock).mockReturnValueOnce("processed response");

      const result = await moviesService.getList(title);

      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: `${baseUrl}?s=${title}&apikey=${accessKey}`,
        method: "get",
      });
      expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
      expect(result).toBe("processed response");
    });

    it("should throw an error if the httpClient request fails", async () => {
      const error = new Error("Request failed");
      mockHttpClient.request.mockRejectedValueOnce(error);

      await expect(moviesService.getList(title)).rejects.toThrow(error.message);

      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: `${baseUrl}?s=${title}&apikey=${accessKey}`,
        method: "get",
      });
    });
  });
});
