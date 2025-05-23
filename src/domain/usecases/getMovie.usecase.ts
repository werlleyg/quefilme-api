import { MovieEntity } from "../entities";
import { NotFoundError } from "../errors";
import { MoviesService } from "../services";
import { GetMovieUsecase } from "./interfaces/getMovie.interface";

export class GetMovieUsecaseImpl implements GetMovieUsecase {
  constructor(private readonly moviesService: MoviesService) {}

  async exec(params: GetMovieUsecase.Params): Promise<GetMovieUsecase.Model> {
    const imdbID = params;
    const result = await this.moviesService.getOne(imdbID);

    if (result?.Response === "False") throw new NotFoundError();

    return MovieEntity.fromJson(result);
  }
}
