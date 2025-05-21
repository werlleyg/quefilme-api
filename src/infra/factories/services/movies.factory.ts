import { MoviesService } from "../../../domain/services";
import { AppConfig } from "../../config";
import { MoviesServiceImpl } from "../../services/moviesImpl.service";
import { makeAxiosHttpClient } from "../http/axiosHttpClient.factory";

export const makeMoviesService = (): MoviesService =>
  new MoviesServiceImpl(
    makeAxiosHttpClient(),
    AppConfig.BASE_URL_MOVIES_SERVICE,
    AppConfig.ACCESS_KEY_MOVIES_SERVICE,
  );
