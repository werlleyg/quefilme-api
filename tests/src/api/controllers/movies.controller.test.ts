import { Request, Response } from "express";
import Zod from "zod";
import { MoviesController } from "../../../../src/api/controllers";
import { makeGetMovieUsecase } from "../../../../src/infra/factories/usecases/getMovie.factory";
import { makeGetMoviesUsecase } from "../../../../src/infra/factories/usecases/getMovies.factory";
import { makeGetMovieSuggestionUsecase } from "../../../../src/infra/factories/usecases/getMovieSuggestion.factory";
import { makeLoggerService } from "../../../../src/infra/factories/services/logger.factory";

// Mock dependencies
jest.mock("../../../../src/infra/factories/usecases/getMovie.factory");
jest.mock("../../../../src/infra/factories/usecases/getMovies.factory");
jest.mock(
  "../../../../src/infra/factories/usecases/getMovieSuggestion.factory",
);
jest.mock("../../../../src/infra/factories/services/logger.factory");

describe("MoviesController", () => {
  let controller: MoviesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLoggerService: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock dates and UUIDs
    const fixedDate = new Date("2025-05-28T10:00:00Z");
    jest.spyOn(Date, "now").mockImplementation(() => fixedDate.getTime());
    jest
      .spyOn(Date.prototype, "toISOString")
      .mockReturnValue(fixedDate.toISOString());
    jest
      .spyOn(crypto, "randomUUID")
      .mockReturnValue("123e4567-e89b-12d3-a456-426614174000");

    controller = new MoviesController();

    // Setup request mock
    mockRequest = {
      method: "GET",
      baseUrl: "/movies",
      ip: "127.0.0.1",
      headers: {
        "user-agent": "test-agent",
      },
      body: {},
      params: {},
      query: {},
    };

    // Setup response mock
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => ({ ...data })),
    };

    // Setup logger mock
    mockLoggerService = {
      info: jest.fn().mockResolvedValue(undefined),
      error: jest.fn().mockResolvedValue(undefined),
    };
    (makeLoggerService as jest.Mock).mockReturnValue(mockLoggerService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getMovie", () => {
    it("should return movie data when imdbId is valid", async () => {
      const movieData = { id: "tt1234567", title: "Test Movie" };
      const mockExec = jest.fn().mockResolvedValue({
        toJSON: movieData, // Alterado: agora é uma propriedade, não uma função
      });
      (makeGetMovieUsecase as jest.Mock).mockReturnValue({ exec: mockExec });
      mockRequest.params = { imdbId: "tt1234567" };

      await controller.getMovie(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockExec).toHaveBeenCalledWith("tt1234567");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(movieData);

      // Verify logger calls
      expect(mockLoggerService.info).toHaveBeenCalledTimes(2);
      expect(mockLoggerService.info).toHaveBeenNthCalledWith(
        1,
        "REQUEST_STARTED",
        {
          metadata: expect.objectContaining({
            controller: "MoviesController",
            method: "getMovie",
            event: "REQUEST_COMPLETED",
          }),
        },
      );
    });

    it("should handle errors and log them properly when imdbId is invalid", async () => {
      mockRequest.params = { imdbId: 123 as unknown as string };

      await expect(
        controller.getMovie(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(Zod.ZodError);

      expect(mockLoggerService.info).toHaveBeenCalledWith(
        "REQUEST_STARTED",
        expect.any(Object),
      );
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "REQUEST_ERROR",
        expect.any(Object),
      );
    });
  });

  describe("getMovies", () => {
    it("should return movies list when title is valid", async () => {
      const moviesData = [{ id: "tt1234567", title: "Test Movie" }];
      const mockExec = jest.fn().mockResolvedValue(
        moviesData.map((movie) => ({
          toJSON: movie,
        })),
      );
      (makeGetMoviesUsecase as jest.Mock).mockReturnValue({ exec: mockExec });
      mockRequest.query = { title: "Inception" };

      await controller.getMovies(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockExec).toHaveBeenCalledWith("Inception");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(moviesData);

      // Verify logger calls
      expect(mockLoggerService.info).toHaveBeenCalledTimes(2);
      expect(mockLoggerService.info).toHaveBeenNthCalledWith(
        1,
        "REQUEST_STARTED",
        {
          metadata: expect.objectContaining({
            controller: "MoviesController",
            method: "getMovies",
            event: "REQUEST_COMPLETED",
          }),
        },
      );
    });

    it("should handle errors when title is missing", async () => {
      mockRequest.query = {};

      await expect(
        controller.getMovies(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(Zod.ZodError);

      expect(mockLoggerService.info).toHaveBeenCalledWith(
        "REQUEST_STARTED",
        expect.any(Object),
      );
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "REQUEST_ERROR",
        expect.any(Object),
      );
    });
  });

  describe("getMovieSuggestion", () => {
    it("should return a movie suggestion when titles are valid", async () => {
      const suggestionData = { id: "tt1234567", title: "Suggested Movie" };
      const mockExec = jest.fn().mockResolvedValue({
        toJSON: () => suggestionData,
      });
      (makeGetMovieSuggestionUsecase as jest.Mock).mockReturnValue({
        exec: mockExec,
      });
      mockRequest.body = { titles: ["Inception", "Interstellar"] };

      await controller.getMovieSuggestion(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockExec).toHaveBeenCalledWith(["Inception", "Interstellar"]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockLoggerService.info).toHaveBeenNthCalledWith(
        1,
        "REQUEST_STARTED",
        {
          metadata: expect.objectContaining({
            controller: "MoviesController",
            method: "getMovieSuggestion",
            event: "REQUEST_COMPLETED",
          }),
        },
      );

      expect(mockLoggerService.info).toHaveBeenCalledTimes(2);
    });

    it("should handle errors when titles are invalid", async () => {
      mockRequest.body = { titles: "InvalidType" };

      await expect(
        controller.getMovieSuggestion(
          mockRequest as Request,
          mockResponse as Response,
        ),
      ).rejects.toThrow(Zod.ZodError);

      expect(mockLoggerService.info).toHaveBeenCalledWith(
        "REQUEST_STARTED",
        expect.any(Object),
      );
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "REQUEST_ERROR",
        expect.any(Object),
      );
    });
  });
});
