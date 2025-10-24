import { AiService } from "../../domain/services";

class AiServiceMapper {
  static toMoviePattern(response: any): AiService.Model {
    const letterAndNumbersRegex: RegExp = /[^a-zA-Z0-9\s-]/g;

    return response.choices[0].message.content.replace(
      "<｜begin▁of▁sentence｜>",
      "",
      letterAndNumbersRegex,
      "",
    );
  }
}

export { AiServiceMapper };
