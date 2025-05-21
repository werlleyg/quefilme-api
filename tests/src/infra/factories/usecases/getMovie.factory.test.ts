import { MoviesService } from "../../../../../src/domain/services";
import { GetMovieUsecaseImpl } from "../../../../../src/domain/usecases";
import { makeMoviesService } from "../../../../../src/infra/factories/services/movies.factory";
import { makeGetMovieUsecase } from "../../../../../src/infra/factories/usecases/getMovie.factory";

// Mock dependencies
jest.mock("../../../../../src/infra/factories/services/movies.factory", () => ({
  makeMoviesService: jest.fn(),
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
    (makeMoviesService as jest.Mock).mockReturnValue(mockMoviesService);

    // Act
    const getMovieUsecase = makeGetMovieUsecase();

    // Assert
    expect(makeMoviesService).toHaveBeenCalled();
    expect(getMovieUsecase).toEqual(new GetMovieUsecaseImpl(mockMoviesService));
  });
});
