import { MovieEntity } from "../../../../src/domain/entities";
import { NotFoundError } from "../../../../src/domain/errors";
import { LoggerService, MoviesService } from "../../../../src/domain/services";
import { GetMovieUsecaseImpl } from "../../../../src/domain/usecases";

describe("GetMovieUsecaseImpl", () => {
  let getMovieUsecase: GetMovieUsecaseImpl;
  let moviesService: jest.Mocked<MoviesService>;
  let loggerService: jest.Mocked<LoggerService>;

  beforeEach(() => {
    moviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    } as unknown as jest.Mocked<MoviesService>;

    loggerService = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLabels: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    getMovieUsecase = new GetMovieUsecaseImpl(moviesService, loggerService);
  });

  it("should instance moviesService currectly", async () => {
    const getMovieUsecaseTest = new GetMovieUsecaseImpl(
      moviesService,
      loggerService,
    );

    expect(getMovieUsecaseTest).toBeInstanceOf(GetMovieUsecaseImpl);
    expect(getMovieUsecaseTest).toHaveProperty("moviesService");
  });

  it("should call moviesService.getOne with correct imdbID", async () => {
    const imdbID = "tt1234567";
    moviesService.getOne.mockResolvedValue({ Response: "True", imdbID });

    await getMovieUsecase.exec(imdbID);

    expect(moviesService.getOne).toHaveBeenCalledWith(imdbID);
  });

  it("should return a MovieEntity when moviesService.getOne returns valid data", async () => {
    const imdbID = "tt1234567";
    const mockMovieData = { Response: "True", imdbID };
    moviesService.getOne.mockResolvedValue(mockMovieData);

    jest.spyOn(MovieEntity, "fromJson").mockReturnValue(mockMovieData as any);

    const result = await getMovieUsecase.exec(imdbID);

    expect(result).toEqual(mockMovieData);
    expect(MovieEntity.fromJson).toHaveBeenCalledWith(mockMovieData);
  });

  it("should throw NotFoundError when moviesService.getOne returns Response: 'False'", async () => {
    const imdbID = "tt1234567";
    moviesService.getOne.mockResolvedValue({ Response: "False" });

    await expect(getMovieUsecase.exec(imdbID)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
