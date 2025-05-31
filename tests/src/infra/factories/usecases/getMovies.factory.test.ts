import {
  MoviesService,
  TranslatorService,
} from "../../../../../src/domain/services";
import { GetMoviesUsecaseImpl } from "../../../../../src/domain/usecases";
import { makeLoggerService } from "../../../../../src/infra/factories/services/logger.factory";
import { makeMoviesService } from "../../../../../src/infra/factories/services/movies.factory";
import { makeTranslatorService } from "../../../../../src/infra/factories/services/translator.factory";
import { makeGetMoviesUsecase } from "../../../../../src/infra/factories/usecases/getMovies.factory";

// Mock dependencies
jest.mock("../../../../../src/infra/factories/services/movies.factory", () => ({
  makeMoviesService: jest.fn(),
}));

jest.mock(
  "../../../../../src/infra/factories/services/translator.factory",
  () => ({
    makeTranslatorService: jest.fn(),
  }),
);

jest.mock("../../../../../src/infra/factories/services/logger.factory", () => ({
  makeLoggerService: jest.fn(),
}));

describe("makeGetMoviesUsecase", () => {
  it("should return an instance of GetMoviesUsecaseImpl", () => {
    // Arrange
    const mockMoviesService: MoviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    };
    const mockTranslatorService: TranslatorService = {
      translator: jest.fn(),
    };
    (makeMoviesService as jest.Mock).mockReturnValue(mockMoviesService);
    (makeTranslatorService as jest.Mock).mockReturnValue(mockTranslatorService);

    // Act
    const getMoviesUsecase = makeGetMoviesUsecase();

    // Assert
    expect(getMoviesUsecase).toBeInstanceOf(GetMoviesUsecaseImpl);
  });

  it("should pass the correct services to the GetMoviesUsecaseImpl constructor", () => {
    // Arrange
    const mockMoviesService: MoviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    };
    const mockTranslatorService: TranslatorService = {
      translator: jest.fn(),
    };
    const mockLoggerService = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      setLabels: jest.fn(),
    };
    (makeMoviesService as jest.Mock).mockReturnValue(mockMoviesService);
    (makeTranslatorService as jest.Mock).mockReturnValue(mockTranslatorService);
    (makeLoggerService as jest.Mock).mockReturnValue(mockLoggerService);

    // Act
    const getMoviesUsecase = makeGetMoviesUsecase();

    // Assert
    expect(makeMoviesService).toHaveBeenCalled();
    expect(makeTranslatorService).toHaveBeenCalled();
    expect(getMoviesUsecase).toEqual(
      new GetMoviesUsecaseImpl(
        mockMoviesService,
        mockTranslatorService,
        mockLoggerService,
      ),
    );
  });
});
