import { MovieEntity } from "../entities";
import { LanguagesEnum } from "../enums";
import { NotFoundError } from "../errors";
import { MoviesService, TranslatorService } from "../services";
import { GetMoviesUsecase } from "./interfaces/getMovies.interface";

export class GetMoviesUsecaseImpl implements GetMoviesUsecase {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly translatorService: TranslatorService,
  ) {}

  async exec(title: GetMoviesUsecase.Params): Promise<GetMoviesUsecase.Model> {
    const params: TranslatorService.Params = {
      query: title.trim().toLowerCase(),
      source: LanguagesEnum.PTBR,
      target: LanguagesEnum.EN,
    };

    const translatorResult = await this.translatorService.translator(params);
    const translatedTitle =
      translatorResult?.data?.translations[0]?.translatedText ?? "";

    const moviesResult = await this.moviesService.getList(
      translatedTitle?.trim()?.toLowerCase(),
    );

    return moviesResult?.Search?.map((movie: any) =>
      MovieEntity.fromJson(movie),
    );
  }
}
