import { MovieEntity } from "../entities";
import { LanguagesEnum } from "../enums";
import { LoggerService, MoviesService, TranslatorService } from "../services";
import { GetMoviesUsecase } from "./interfaces/getMovies.interface";

export class GetMoviesUsecaseImpl implements GetMoviesUsecase {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly translatorService: TranslatorService,
    private readonly logger: LoggerService,
  ) {}

  async exec(title: GetMoviesUsecase.Params): Promise<GetMoviesUsecase.Model> {
    const params: TranslatorService.Params = {
      query: title.trim().toLowerCase(),
      source: LanguagesEnum.PTBR,
      target: LanguagesEnum.EN,
    };

    await this.logger.info(
      `[GetMoviesUsecase] Translating title: ${params.query} from ${params.source} to ${params.target}`,
    );

    const translatorResult = await this.translatorService.translator(params);

    const translatedTitle =
      translatorResult?.data?.translations[0]?.translatedText ?? "";

    await this.logger.info(
      `[GetMoviesUsecase] Translated title: ${translatedTitle}`,
    );

    try {
      await this.logger.info(
        `[GetMoviesUsecase] Fetched movies for title: ${translatedTitle}`,
      );

      const moviesResult = await this.moviesService.getList(
        translatedTitle?.trim()?.toLowerCase(),
      );

      return moviesResult?.Search?.map((movie: any) =>
        MovieEntity.fromJson(movie),
      );
    } catch (error) {
      await this.logger.error(
        `[GetMoviesUsecase] Error fetching movies: ${error.message}`,
      );

      return [];
    }
  }
}
