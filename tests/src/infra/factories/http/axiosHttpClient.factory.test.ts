// filepath: src/infra/factories/http/axiosHttpClient.factory.test.ts

import { makeAxiosHttpClient } from "../../../../../src/infra/factories/http/axiosHttpClient.factory";
import { AxiosHttpClient } from "../../../../../src/infra/http/axiosHttpClient.protocol";

jest.mock("../../../../../src/infra/http/axiosHttpClient.protocol");

describe("makeAxiosHttpClient", () => {
  it("should create and return an instance of AxiosHttpClient", () => {
    const axiosHttpClientInstance = makeAxiosHttpClient();

    expect(AxiosHttpClient).toHaveBeenCalledTimes(1);
    expect(axiosHttpClientInstance).toBeInstanceOf(AxiosHttpClient);
  });
});
