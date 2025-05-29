import Zod from "zod";
import { Request, Response } from "express";
import { makeGetMovieUsecase } from "../../infra/factories/usecases/getMovie.factory";
import { makeGetMoviesUsecase } from "../../infra/factories/usecases/getMovies.factory";
import { makeGetMovieSuggestionUsecase } from "../../infra/factories/usecases/getMovieSuggestion.factory";
import { ControllerLogger } from "../decorators/logger.decorator";

export class MoviesController {
  /**
   * Get Movie
   * @param {Request} request - The Express request object with imdbId in path params.
   * @param {Response} response - The Express response object to send the Movie as JSON.
   */
  @ControllerLogger()
  public async getMovie(request: Request, response: Response) {
    const paramsSchema = Zod.object({
      imdbId: Zod.string(),
    }).strict();

    const { imdbId } = paramsSchema.parse(request.params);

    const res = await makeGetMovieUsecase().exec(imdbId);

    return response.status(200).json(res.toJSON);
  }

  /**
   * Get Movies
   * @param {Request} request - The Express request object with title in query params.
   * @param {Response} response - The Express response object to send the Movies list as JSON.
   */
  @ControllerLogger()
  public async getMovies(request: Request, response: Response) {
    const querySchema = Zod.object({
      title: Zod.string(),
    }).strict();

    const { title } = querySchema.parse(request.query);

    const res = await makeGetMoviesUsecase().exec(title);

    return response.status(200).json(res.map((m) => m.toJSON));
  }

  /**
   * Get Movie Suggestion
   * @param {Request} request - The Express request object with movies titles list in body.
   * @param {Response} response - The Express response object to send the Suggestion Movie as JSON.
   */
  @ControllerLogger()
  public async getMovieSuggestion(request: Request, response: Response) {
    const bodySchema = Zod.object({
      titles: Zod.array(Zod.string()),
    }).strict();

    const { titles } = bodySchema.parse(request.body);

    const res = await makeGetMovieSuggestionUsecase().exec(titles);

    return response.status(200).json(res.toJSON);
  }
}
