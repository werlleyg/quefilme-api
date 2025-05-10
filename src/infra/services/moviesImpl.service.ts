import { HttpClient } from "../../domain/protocols/http";
import { MoviesService } from "../../domain/services";
import { ResponseHandler } from "../shared/responseHandler.shared";

export class MoviesServiceImpl implements MoviesService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl: string,
    private readonly accessKey: string,
  ) {}

  async getOne(
    params: MoviesService.getOne.Params,
  ): Promise<MoviesService.getOne.Model> {
    if (!params || typeof params !== "string" || !params.trim()) {
      throw new Error("Invalid IMDb ID: ID must be a non-empty string");
    }

    const imdbID = params;
    const httpResponse = await this.httpClient.request({
      url: `${this.baseUrl}?i=${encodeURIComponent(imdbID)}&apikey=${
        this.accessKey
      }`,
      method: "get",
    });

    return ResponseHandler(httpResponse);
  }

  async getList(
    params: MoviesService.getList.Params,
  ): Promise<MoviesService.getList.Model> {
    if (!params || typeof params !== "string" || !params.trim()) {
      throw new Error("Invalid title: Title must be a non-empty string");
    }

    const title = params;
    const httpResponse = await this.httpClient.request({
      url: `${this.baseUrl}?s=${encodeURIComponent(title)}&apikey=${
        this.accessKey
      }`,
      method: "get",
    });

    return ResponseHandler(httpResponse);
  }
}
