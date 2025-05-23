import { GetMovieSuggestionUsecaseImpl } from "../../../../../src/domain/usecases";
import { makeMoviesService } from "../../../../../src/infra/factories/services/movies.factory";
import { makeAiService } from "../../../../../src/infra/factories/services/ai.factory";
import { makeGetMovieSuggestionUsecase } from "../../../../../src/infra/factories/usecases/getMovieSuggestion.factory";
import { MoviesService, AiService } from "../../../../../src/domain/services";

// Mock dependencies
jest.mock("../../../../../src/infra/factories/services/movies.factory", () => ({
  makeMoviesService: jest.fn(),
}));

jest.mock("../../../../../src/infra/factories/services/ai.factory", () => ({
  makeAiService: jest.fn(),
}));

describe("makeGetMovieSuggestionUsecase", () => {
  it("should return an instance of GetMovieSuggestionUsecaseImpl", () => {
    // Arrange
    const mockMoviesService: MoviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    };
    const mockAiService: AiService = {
      generateResponse: jest.fn(),
    };
    (makeMoviesService as jest.Mock).mockReturnValue(mockMoviesService);
    (makeAiService as jest.Mock).mockReturnValue(mockAiService);

    // Act
    const getMovieSuggestionUsecase = makeGetMovieSuggestionUsecase();

    // Assert
    expect(getMovieSuggestionUsecase).toBeInstanceOf(
      GetMovieSuggestionUsecaseImpl,
    );
  });

  it("should pass the correct services to the GetMovieSuggestionUsecaseImpl constructor", () => {
    // Arrange
    const mockMoviesService: MoviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    };
    const mockAiService: AiService = {
      generateResponse: jest.fn(),
    };
    (makeMoviesService as jest.Mock).mockReturnValue(mockMoviesService);
    (makeAiService as jest.Mock).mockReturnValue(mockAiService);

    // Act
    const getMovieSuggestionUsecase = makeGetMovieSuggestionUsecase();

    // Assert
    expect(makeMoviesService).toHaveBeenCalled();
    expect(makeAiService).toHaveBeenCalled();
    expect(getMovieSuggestionUsecase).toEqual(
      new GetMovieSuggestionUsecaseImpl(mockMoviesService, mockAiService),
    );
  });
});
