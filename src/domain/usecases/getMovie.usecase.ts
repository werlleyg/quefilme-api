import { MovieEntity } from "../entities";
import { NotFoundError } from "../errors";
import { LoggerService, MoviesService } from "../services";
import { GetMovieUsecase } from "./interfaces/getMovie.interface";

export class GetMovieUsecaseImpl implements GetMovieUsecase {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly logger: LoggerService,
  ) {}

  async exec(params: GetMovieUsecase.Params): Promise<GetMovieUsecase.Model> {
    const imdbID = params;

    await this.logger.info(
      `[GetMovieUsecase] Fetching movie with IMDB ID: ${imdbID}`,
    );

    const result = await this.moviesService.getOne(imdbID);

    if (result?.Response === "False") {
      await this.logger.error(
        `[GetMovieUsecase] Movie with IMDB ID: ${imdbID} not found`,
      );
      throw new NotFoundError();
    }

    await this.logger.info(
      `[GetMovieUsecase] Successfully fetched movie with IMDB ID: ${imdbID}`,
    );

    return MovieEntity.fromJson(result);
  }
}
