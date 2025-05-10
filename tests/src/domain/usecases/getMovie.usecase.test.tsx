import { MovieEntity } from "../../../../src/domain/entities";
import { NotFoundError } from "../../../../src/domain/errors";
import { MoviesService } from "../../../../src/domain/services";
import { GetMovieUsecaseImpl } from "../../../../src/domain/usecases";

describe("GetMovieUsecaseImpl", () => {
  let getMovieUsecase: GetMovieUsecaseImpl;
  let moviesService: jest.Mocked<MoviesService>;

  beforeEach(() => {
    moviesService = {
      getOne: jest.fn(),
      getList: jest.fn(),
    } as unknown as jest.Mocked<MoviesService>;

    getMovieUsecase = new GetMovieUsecaseImpl(moviesService);
  });

  it("should instance moviesService currectly", async () => {
    const getMovieUsecaseTest = new GetMovieUsecaseImpl(moviesService);

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
