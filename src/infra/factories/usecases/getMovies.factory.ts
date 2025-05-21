import { GetMoviesUsecaseImpl } from "../../../domain/usecases";
import { GetMoviesUsecase } from "../../../domain/usecases/interfaces";
import { makeMoviesService } from "../services/movies.factory";
import { makeTranslatorService } from "../services/translator.factory";

export const makeGetMoviesUsecase = (): GetMoviesUsecase =>
  new GetMoviesUsecaseImpl(makeMoviesService(), makeTranslatorService());
