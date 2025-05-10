import { MovieEntity } from "../../../../src/domain/entities";
import { NotFoundError, UnexpectedError } from "../../../../src/domain/errors";
import { GetMovieSuggestionUsecaseImpl } from "../../../../src/domain/usecases";

describe("GetMovieSuggestionUsecaseImpl", () => {
  const mockMoviesService = {
    getOne: jest.fn(),
  };

  const mockAiService = {
    generateResponse: jest.fn(),
  };

  const getSuggestionUsecase = new GetMovieSuggestionUsecaseImpl(
    mockMoviesService as any,
    mockAiService as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a MovieEntity when suggestion and movie are valid", async () => {
    const mockParams = ["Matrix", "Inception"];
    const imdbID = "tt1234567";

    mockAiService.generateResponse.mockResolvedValue({
      choices: [
        {
          message: {
            content: `Tenet - ${imdbID}`,
          },
        },
      ],
    });

    const movieData = { Title: "Tenet", imdbID, Response: "True" };
    mockMoviesService.getOne.mockResolvedValue(movieData);

    const result = await getSuggestionUsecase.exec(mockParams);

    expect(mockAiService.generateResponse).toHaveBeenCalled();
    expect(mockMoviesService.getOne).toHaveBeenCalledWith(imdbID);
    expect(result).toEqual(MovieEntity.fromJson(movieData));
  });

  it("should throw UnexpectedError when AI response format is invalid", async () => {
    mockAiService.generateResponse.mockResolvedValue({
      choices: [
        {
          message: {
            content: "This is an invalid format",
          },
        },
      ],
    });

    await expect(getSuggestionUsecase.exec(["Matrix"])).rejects.toBeInstanceOf(
      UnexpectedError,
    );
  });

  it("should throw NotFoundError when movie is not found", async () => {
    const imdbID = "tt0000000";

    mockAiService.generateResponse.mockResolvedValue({
      choices: [
        {
          message: {
            content: `Tenet - ${imdbID}`,
          },
        },
      ],
    });

    mockMoviesService.getOne.mockResolvedValue({ Response: "False" });

    await expect(getSuggestionUsecase.exec(["Matrix"])).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should handle special characters in AI response", async () => {
    const imdbID = "tt7654321";
    const rawResponse = `Tenet!!! - ${imdbID}###`;

    mockAiService.generateResponse.mockResolvedValue({
      choices: [
        {
          message: {
            content: rawResponse,
          },
        },
      ],
    });

    const movieData = { Title: "Tenet", imdbID, Response: "True" };
    mockMoviesService.getOne.mockResolvedValue(movieData);

    const result = await getSuggestionUsecase.exec(["Matrix"]);

    expect(result).toEqual(MovieEntity.fromJson(movieData));
  });
});
