import { HttpStatusCodeEnum } from "../../../../src/domain/enums";

describe("HttpStatusCodeEnum", () => {
  it("should have the correct values", () => {
    expect(HttpStatusCodeEnum.ok).toBe(200);
    expect(HttpStatusCodeEnum.noContent).toBe(204);
    expect(HttpStatusCodeEnum.badRequest).toBe(400);
    expect(HttpStatusCodeEnum.unauthorized).toBe(401);
    expect(HttpStatusCodeEnum.forbidden).toBe(403);
    expect(HttpStatusCodeEnum.notFound).toBe(404);
    expect(HttpStatusCodeEnum.serverError).toBe(500);
  });

  it("should return correct values when accessed by keys", () => {
    expect(HttpStatusCodeEnum["ok"]).toBe(200);
    expect(HttpStatusCodeEnum["noContent"]).toBe(204);
    expect(HttpStatusCodeEnum["badRequest"]).toBe(400);
    expect(HttpStatusCodeEnum["unauthorized"]).toBe(401);
    expect(HttpStatusCodeEnum["forbidden"]).toBe(403);
    expect(HttpStatusCodeEnum["notFound"]).toBe(404);
    expect(HttpStatusCodeEnum["serverError"]).toBe(500);
  });
});
