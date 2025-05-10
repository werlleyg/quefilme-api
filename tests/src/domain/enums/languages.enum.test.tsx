import { LanguagesEnum } from "../../../../src/domain/enums/languages.enum";

describe("LanguagesEnum", () => {
  it("should have the correct values", () => {
    expect(LanguagesEnum.PTBR).toBe("pt-br");
    expect(LanguagesEnum.EN).toBe("en");
  });

  it("should contain only defined keys", () => {
    expect(Object.keys(LanguagesEnum)).toEqual(["PTBR", "EN"]);
  });
});
