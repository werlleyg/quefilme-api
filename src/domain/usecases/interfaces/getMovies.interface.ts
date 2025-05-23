import { MovieEntity } from "../../entities";

export interface GetMoviesUsecase {
  exec: (params: GetMoviesUsecase.Params) => Promise<GetMoviesUsecase.Model>;
}

export namespace GetMoviesUsecase {
  export type Params = string;
  export type Model = MovieEntity[];
}
