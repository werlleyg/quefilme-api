import { Request, Response } from "express";
import Zod from "zod";
import { MoviesController } from "../../../../src/api/controllers";
import { makeGetMovieUsecase } from "../../../../src/infra/factories/usecases/getMovie.factory";
import { makeGetMoviesUsecase } from "../../../../src/infra/factories/usecases/getMovies.factory";
import { makeGetMovieSuggestionUsecase } from "../../../../src/infra/factories/usecases/getMovieSuggestion.factory";

// Mock dependencies
jest.mock("../../../../src/infra/factories/usecases/getMovie.factory", () => ({
  makeGetMovieUsecase: jest.fn(),
}));

jest.mock("../../../../src/infra/factories/usecases/getMovies.factory", () => ({
  makeGetMoviesUsecase: jest.fn(),
}));

jest.mock(
  "../../../../src/infra/factories/usecases/getMovieSuggestion.factory",
  () => ({
    makeGetMovieSuggestionUsecase: jest.fn(),
  }),
);

describe("MoviesController", () => {
  let controller: MoviesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new MoviesController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getMovie", () => {
    it("should return movie data when imdbId is valid", async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue({
        toJSON: jest.fn(() => ({ id: "tt1234567" })), // Corrigido para retornar o objeto esperado
      });
      (makeGetMovieUsecase as jest.Mock).mockReturnValue({ exec: mockExec });
      mockRequest.params = { imdbId: "tt1234567" };

      // Act
      await controller.getMovie(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockExec).toHaveBeenCalledWith("tt1234567");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 when imdbId is invalid", async () => {
      // Arrange
      mockRequest.params = { imdbId: 123 as unknown as string }; // Invalid type

      // Act
      await expect(
        controller.getMovie(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(Zod.ZodError);
    });
  });

  describe("getMovies", () => {
    it("should return movies list when title is valid", async () => {
      // Arrange
      const mockExec = jest
        .fn()
        .mockResolvedValue([
          { toJSON: jest.fn().mockReturnValue({ id: "tt1234567" }) },
        ]);
      (makeGetMoviesUsecase as jest.Mock).mockReturnValue({ exec: mockExec });
      mockRequest.query = { title: "Inception" };

      // Act
      await controller.getMovies(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockExec).toHaveBeenCalledWith("Inception");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 when title is missing", async () => {
      // Arrange
      mockRequest.query = {}; // Missing title

      // Act
      await expect(
        controller.getMovies(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(Zod.ZodError);
    });
  });

  describe("getMovieSuggestion", () => {
    it("should return a movie suggestion when titles are valid", async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue({
        toJSON: jest.fn().mockReturnValue({ id: "tt1234567" }),
      });
      (makeGetMovieSuggestionUsecase as jest.Mock).mockReturnValue({
        exec: mockExec,
      });
      mockRequest.body = { titles: ["Inception", "Interstellar"] };

      // Act
      await controller.getMovieSuggestion(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockExec).toHaveBeenCalledWith(["Inception", "Interstellar"]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 when titles are invalid", async () => {
      // Arrange
      mockRequest.body = { titles: "InvalidType" }; // Invalid type

      // Act
      await expect(
        controller.getMovieSuggestion(
          mockRequest as Request,
          mockResponse as Response,
        ),
      ).rejects.toThrow(Zod.ZodError);
    });
  });
});
