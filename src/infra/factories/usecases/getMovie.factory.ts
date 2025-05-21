import { GetMovieUsecaseImpl } from "../../../domain/usecases";
import { GetMovieUsecase } from "../../../domain/usecases/interfaces";
import { makeMoviesService } from "../services/movies.factory";

export const makeGetMovieUsecase = (): GetMovieUsecase =>
  new GetMovieUsecaseImpl(makeMoviesService());
