import { MovieEntity } from "../entities";

export interface MoviesService {
  getOne: (
    params: MoviesService.getOne.Params,
  ) => Promise<MoviesService.getOne.Model>;
  getList: (
    params: MoviesService.getList.Params,
  ) => Promise<MoviesService.getList.Model>;
}

export namespace MoviesService.getOne {
  export type Params = string;
  export type Model = any;
}

export namespace MoviesService.getList {
  export type Params = string;
  export type Model = any;
}
