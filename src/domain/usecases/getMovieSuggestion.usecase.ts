import { MovieEntity } from "../entities";
import { NotFoundError, UnexpectedError } from "../errors";
import { MoviesService } from "../services";
import { AiService } from "../services/ai.service";
import { GetMovieSuggestionUsecase } from "./interfaces/getMovieSuggestion.interface";

export class GetMovieSuggestionUsecaseImpl
  implements GetMovieSuggestionUsecase
{
  _letterAndNumbersRegex: RegExp = /[^a-zA-Z0-9\s-]/g;

  constructor(
    private readonly moviesService: MoviesService,
    private readonly aiService: AiService,
  ) {}
  async exec(
    params: GetMovieSuggestionUsecase.Params,
  ): Promise<GetMovieSuggestionUsecase.Model> {
    const listOfMovies = params.join(", ");

    const prompt = `Seja direto e siga exatamente o exemplo proposto a seguir após os dois pontos, me indique apenas um filme baseado na lista ${listOfMovies}, mas não pode ser nenhum dessa lista e nem repetir a sugestão anterior, seja criativo na escolha mas retorne algo que combine com os itens de lista, e coloque seu imdb CORRETO no final, ex: Cidade de Deus - tt0317248`;

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

    const movieResult = await this.moviesService.getOne(suggestMovieImdb);

    if (movieResult?.Response === "False") throw new NotFoundError();

    return MovieEntity.fromJson(movieResult);
  }
}
