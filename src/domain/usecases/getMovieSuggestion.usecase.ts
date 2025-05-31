import { log } from "console";
import { MovieEntity } from "../entities";
import { NotFoundError, UnexpectedError } from "../errors";
import { LoggerService, MoviesService } from "../services";
import { AiService } from "../services/ai.service";
import { GetMovieSuggestionUsecase } from "./interfaces/getMovieSuggestion.interface";

export class GetMovieSuggestionUsecaseImpl
  implements GetMovieSuggestionUsecase
{
  private readonly _letterAndNumbersRegex: RegExp = /[^a-zA-Z0-9\s-]/g;
  private readonly _imdbMovieRegex: RegExp = /^tt\d+$/;

  constructor(
    private readonly moviesService: MoviesService,
    private readonly aiService: AiService,
    private readonly logger: LoggerService,
  ) {}
  async exec(
    params: GetMovieSuggestionUsecase.Params,
  ): Promise<GetMovieSuggestionUsecase.Model> {
    const listOfMovies = params.join(", ");

    const prompt = `Seja direto e siga exatamente o exemplo proposto a seguir após os dois pontos, me indique apenas um filme baseado na lista ${listOfMovies}, mas não pode ser nenhum dessa lista e nem repetir a sugestão anterior, seja criativo na escolha mas retorne algo que combine com os itens de lista, e coloque seu imdb CORRETO no final, ex: Cidade de Deus - tt0317248`;

    await this.logger.info(
      `[GetMovieSuggestionUsecase] Generating movie suggestion for: ${listOfMovies}`,
    );

    try {
      const promptResult = await this.aiService.generateResponse(prompt);

      const result = await promptResult.choices[0].message.content.replace(
        this._letterAndNumbersRegex,
        "",
      );

      const parts = await result?.split(" - ");
      if (!parts || parts?.length < 2) {
        throw new UnexpectedError();
      }
      const suggestMovieImdb = parts[1];

      await this.logger.info(
        `[GetMovieSuggestionUsecase] Received movie suggestion: ${suggestMovieImdb}`,
      );

      // Validate IMDb ID format (tt followed by digits)
      if (!suggestMovieImdb.match(this._imdbMovieRegex)) {
        await this.logger.error(
          `[GetMovieSuggestionUsecase] Invalid IMDb ID format: ${suggestMovieImdb}`,
        );
        throw new UnexpectedError("Invalid IMDb ID format");
      }

      const movieResult = await this.moviesService.getOne(suggestMovieImdb);

      if (movieResult?.Response === "False") {
        await this.logger.error(
          `[GetMovieSuggestionUsecase] Movie with IMDB ID: ${suggestMovieImdb} not found`,
        );
        throw new NotFoundError();
      }

      await this.logger.info(
        `[GetMovieSuggestionUsecase] Successfully fetched movie suggestion: ${movieResult.Title}`,
      );

      return MovieEntity.fromJson(movieResult);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnexpectedError) {
        await this.logger.error(
          `[GetMovieSuggestionUsecase] Error fetching movie suggestion: ${error.message}`,
        );
        throw error;
      }
      await this.logger.error(
        `[GetMovieSuggestionUsecase] Unexpected error while getting movie suggestion: ${error.message}`,
      );
      throw new UnexpectedError("Error while getting movie suggestion");
    }
  }
}
