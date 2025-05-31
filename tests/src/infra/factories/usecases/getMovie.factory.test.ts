import { MoviesService } from "../../../../../src/domain/services";
import { GetMovieUsecaseImpl } from "../../../../../src/domain/usecases";
import { makeLoggerService } from "../../../../../src/infra/factories/services/logger.factory";
import { makeMoviesService } from "../../../../../src/infra/factories/services/movies.factory";
import { makeGetMovieUsecase } from "../../../../../src/infra/factories/usecases/getMovie.factory";

// Mock dependencies
jest.mock("../../../../../src/infra/factories/services/movies.factory", () => ({
  makeMoviesService: jest.fn(),
}));
jest.mock("../../../../../src/infra/factories/services/logger.factory", () => ({
  makeLoggerService: jest.fn(),
}));

describe("makeGetMovieUsecase", () => {
  it("should return an instance of GetMovieUsecaseImpl", () => {
    // Arrange
    const mockMoviesService: MoviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    }; // Mock movies service
    (makeMoviesService as jest.Mock).mockReturnValue(mockMoviesService);

    // Act
    const getMovieUsecase = makeGetMovieUsecase();

    // Assert
    expect(getMovieUsecase).toBeInstanceOf(GetMovieUsecaseImpl);
  });

  it("should pass the correct service to the GetMovieUsecaseImpl constructor", () => {
    // Arrange
    const mockMoviesService: MoviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    }; // Mock movies service
    const mockLoggerService = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      setLabels: jest.fn(),
    }; // Mock logger service
    (makeMoviesService as jest.Mock).mockReturnValue(mockMoviesService);
    (makeLoggerService as jest.Mock).mockReturnValue(mockLoggerService);

    // Act
    const getMovieUsecase = makeGetMovieUsecase();

    // Assert
    expect(makeMoviesService).toHaveBeenCalled();
    expect(getMovieUsecase).toEqual(
      new GetMovieUsecaseImpl(mockMoviesService, mockLoggerService),
    );
  });
});
