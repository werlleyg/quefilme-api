import { MovieEntity } from "../../../../src/domain/entities";
import { LanguagesEnum } from "../../../../src/domain/enums";
import {
  LoggerService,
  MoviesService,
  TranslatorService,
} from "../../../../src/domain/services";
import { GetMoviesUsecaseImpl } from "../../../../src/domain/usecases";

describe("GetMoviesUsecaseImpl", () => {
  let getMoviesUsecase: GetMoviesUsecaseImpl;
  let moviesService: jest.Mocked<MoviesService>;
  let translatorService: jest.Mocked<TranslatorService>;
  let loggerService: jest.Mocked<LoggerService>;

  beforeEach(() => {
    moviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    } as unknown as jest.Mocked<MoviesService>;

    translatorService = {
      translator: jest.fn(),
    } as unknown as jest.Mocked<TranslatorService>;

    loggerService = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      setLabels: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    getMoviesUsecase = new GetMoviesUsecaseImpl(
      moviesService,
      translatorService,
      loggerService,
    );
  });

  it("should call translatorService.translator with correct params", async () => {
    const title = "O Poderoso Chefão";
    const translatedTitle = "The Godfather";

    translatorService.translator.mockResolvedValue({
      data: { translations: [{ translatedText: translatedTitle }] },
    });

    moviesService.getList.mockResolvedValue({ Search: [] });

    await getMoviesUsecase.exec(title);

    expect(translatorService.translator).toHaveBeenCalledWith({
      query: title.trim().toLowerCase(),
      source: LanguagesEnum.PTBR,
      target: LanguagesEnum.EN,
    });
  });

  it("should call moviesService.getList with the translated title", async () => {
    const title = "O Poderoso Chefão";
    const translatedTitle = "The Godfather";

    translatorService.translator.mockResolvedValue({
      data: { translations: [{ translatedText: translatedTitle }] },
    });

    moviesService.getList.mockResolvedValue({ Search: [] });

    await getMoviesUsecase.exec(title);

    expect(moviesService.getList).toHaveBeenCalledWith(
      translatedTitle.trim().toLowerCase(),
    );
  });

  it("should return an array of MovieEntity when moviesService.getList returns results", async () => {
    const title = "O Poderoso Chefão";
    const translatedTitle = "The Godfather";
    const mockMovies = [
      { Title: "The Godfather", Year: "1972", imdbID: "tt0068646" },
      { Title: "The Godfather: Part II", Year: "1974", imdbID: "tt0071562" },
    ];

    translatorService.translator.mockResolvedValue({
      data: { translations: [{ translatedText: translatedTitle }] },
    });

    moviesService.getList.mockResolvedValue({ Search: mockMovies });

    jest
      .spyOn(MovieEntity, "fromJson")
      .mockImplementation((data) => data as any);

    const result = await getMoviesUsecase.exec(title);

    expect(result).toEqual(mockMovies);
    expect(MovieEntity.fromJson).toHaveBeenCalledTimes(mockMovies.length);
  });

  it("should return an empty array when moviesService.getList returns no results", async () => {
    const title = "Filme Inexistente";
    const translatedTitle = "Nonexistent Movie";

    translatorService.translator.mockResolvedValue({
      data: { translations: [{ translatedText: translatedTitle }] },
    });

    moviesService.getList.mockResolvedValue({ Search: [] });

    const result = await getMoviesUsecase.exec(title);

    expect(result).toEqual([]);
  });

  it("should return an empty array when translatorService fails or returns no data", async () => {
    const title = "O Poderoso Chefão";

    translatorService.translator.mockResolvedValue(null);
    moviesService.getList.mockResolvedValue({ Search: [] });

    const result = await getMoviesUsecase.exec(title);

    expect(result).toEqual([]);
  });

  it("should return an empty array and log error when moviesService.getList throws", async () => {
    const title = "O Poderoso Chefão";
    const translatedTitle = "The Godfather";
    const error = new Error("API error");

    translatorService.translator.mockResolvedValue({
      data: { translations: [{ translatedText: translatedTitle }] },
    });

    moviesService.getList.mockRejectedValue(error);

    const result = await getMoviesUsecase.exec(title);

    expect(result).toEqual([]);
    expect(loggerService.error).toHaveBeenCalledWith(
      `[GetMoviesUsecase] Error fetching movies: ${error.message}`,
    );
  });
});
