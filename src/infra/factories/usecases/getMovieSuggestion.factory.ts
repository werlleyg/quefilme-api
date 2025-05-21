import { GetMovieSuggestionUsecaseImpl } from "../../../domain/usecases";
import { GetMovieSuggestionUsecase } from "../../../domain/usecases/interfaces";
import { makeAiService } from "../services/ai.factory";
import { makeMoviesService } from "../services/movies.factory";

export const makeGetMovieSuggestionUsecase = (): GetMovieSuggestionUsecase =>
  new GetMovieSuggestionUsecaseImpl(makeMoviesService(), makeAiService());
