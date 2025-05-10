import { MovieEntity } from "../../entities";

export interface GetMovieUsecase {
  exec: (params: GetMovieUsecase.Params) => Promise<GetMovieUsecase.Model>;
}

export namespace GetMovieUsecase {
  export type Params = string;
  export type Model = MovieEntity;
}
