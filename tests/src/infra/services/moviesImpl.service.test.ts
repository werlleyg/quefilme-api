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
  describe("MoviesServiceImpl - httpResponse handling", () => {
    describe("getOne", () => {
      const imdbID = "tt1234567";

      it("should correctly handle a valid httpResponse", async () => {
        const mockResponse: HttpResponse = {
          statusCode: 200,
          body: { data: "mocked response" },
        };
        mockHttpClient.request.mockResolvedValueOnce(mockResponse);
        (ResponseHandler as jest.Mock).mockReturnValueOnce(
          "processed response",
        );

        const result = await moviesService.getOne(imdbID);

        expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
        expect(result).toBe("processed response");
      });

      it("should throw an error if httpResponse is invalid", async () => {
        const mockResponse: HttpResponse = {
          statusCode: 500,
          body: null,
        };
        mockHttpClient.request.mockResolvedValueOnce(mockResponse);
        (ResponseHandler as jest.Mock).mockImplementation(() => {
          throw new Error("Invalid response");
        });

        await expect(moviesService.getOne(imdbID)).rejects.toThrow(
          "Invalid response",
        );
        expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
      });

      it("should throw an error if params is null or undefined", async () => {
        await expect(moviesService.getOne(null as any)).rejects.toThrow(
          "Invalid IMDb ID: ID must be a non-empty string",
        );
        await expect(moviesService.getOne(undefined as any)).rejects.toThrow(
          "Invalid IMDb ID: ID must be a non-empty string",
        );
      });

      it("should throw an error if params is not a string", async () => {
        await expect(moviesService.getOne(123 as any)).rejects.toThrow(
          "Invalid IMDb ID: ID must be a non-empty string",
        );
        await expect(moviesService.getOne({} as any)).rejects.toThrow(
          "Invalid IMDb ID: ID must be a non-empty string",
        );
      });

      it("should throw an error if params is an empty string", async () => {
        await expect(moviesService.getOne("")).rejects.toThrow(
          "Invalid IMDb ID: ID must be a non-empty string",
        );
        await expect(moviesService.getOne("   ")).rejects.toThrow(
          "Invalid IMDb ID: ID must be a non-empty string",
        );
      });
    });

    describe("getList", () => {
      const title = "Inception";

      it("should correctly handle a valid httpResponse", async () => {
        const mockResponse: HttpResponse = {
          statusCode: 200,
          body: { data: "mocked response" },
        };
        mockHttpClient.request.mockResolvedValueOnce(mockResponse);
        (ResponseHandler as jest.Mock).mockReturnValueOnce(
          "processed response",
        );

        const result = await moviesService.getList(title);

        expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
        expect(result).toBe("processed response");
      });

      it("should throw an error if httpResponse is invalid", async () => {
        const mockResponse: HttpResponse = {
          statusCode: 404,
          body: null,
        };
        mockHttpClient.request.mockResolvedValueOnce(mockResponse);
        (ResponseHandler as jest.Mock).mockImplementation(() => {
          throw new Error("Invalid response");
        });

        await expect(moviesService.getList(title)).rejects.toThrow(
          "Invalid response",
        );
        expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
      });

      it("should throw an error if params is null or undefined", async () => {
        await expect(moviesService.getList(null as any)).rejects.toThrow(
          "Invalid title: Title must be a non-empty string",
        );
        await expect(moviesService.getList(undefined as any)).rejects.toThrow(
          "Invalid title: Title must be a non-empty string",
        );
      });

      it("should throw an error if params is not a string", async () => {
        await expect(moviesService.getList(123 as any)).rejects.toThrow(
          "Invalid title: Title must be a non-empty string",
        );
        await expect(moviesService.getList({} as any)).rejects.toThrow(
          "Invalid title: Title must be a non-empty string",
        );
      });

      it("should throw an error if params is an empty string", async () => {
        await expect(moviesService.getList("")).rejects.toThrow(
          "Invalid title: Title must be a non-empty string",
        );
        await expect(moviesService.getList("   ")).rejects.toThrow(
          "Invalid title: Title must be a non-empty string",
        );
      });
    });
  });
});
