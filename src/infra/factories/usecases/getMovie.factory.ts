import { GetMovieUsecaseImpl } from "../../../domain/usecases";
import { GetMovieUsecase } from "../../../domain/usecases/interfaces";
import { makeLoggerService } from "../services/logger.factory";
import { makeMoviesService } from "../services/movies.factory";

export const makeGetMovieUsecase = (): GetMovieUsecase =>
  new GetMovieUsecaseImpl(makeMoviesService(), makeLoggerService());
