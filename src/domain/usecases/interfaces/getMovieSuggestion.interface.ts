import { MovieEntity } from "../../entities/";

export interface GetMovieSuggestionUsecase {
  exec: (
    params: GetMovieSuggestionUsecase.Params,
  ) => Promise<GetMovieSuggestionUsecase.Model>;
}

export namespace GetMovieSuggestionUsecase {
  export type Params = String[];
  export type Model = MovieEntity;
}
