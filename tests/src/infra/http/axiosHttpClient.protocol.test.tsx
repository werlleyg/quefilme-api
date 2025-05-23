import axios, { AxiosResponse } from "axios";
import { AxiosHttpClient } from "../../../../src/infra/http";
import { HttpRequest } from "../../../../src/domain/protocols/http";

jest.mock("axios", () => ({
  request: jest.fn(),
  isAxiosError: jest.fn(),
  ...jest.fn(),
}));

describe("AxiosHttpClient", () => {
  let httpClient: AxiosHttpClient;
  let mockAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    httpClient = new AxiosHttpClient();
    mockAxios = axios as jest.Mocked<typeof axios>;
  });

  it("should call axios with the correct parameters", async () => {
    const requestData: HttpRequest = {
      url: "https://api.example.com/data",
      method: "get",
      headers: { Authorization: "Bearer token" },
    };

    mockAxios.request.mockResolvedValueOnce({
      status: 200,
      data: { success: true },
    } as AxiosResponse);

    const response = await httpClient.request(requestData);

    expect(mockAxios.request).toHaveBeenCalledWith({
      url: requestData.url,
      method: requestData.method,
      data: undefined,
      headers: requestData.headers,
    });

    expect(response).toEqual({
      statusCode: 200,
      body: { success: true },
    });
  });

  it("should include the request body if provided", async () => {
    const requestData: HttpRequest = {
      url: "https://api.example.com/data",
      method: "post",
      body: { name: "John" },
    };

    mockAxios.request.mockResolvedValueOnce({
      status: 201,
      data: { id: 1, name: "John" },
    } as AxiosResponse);

    const response = await httpClient.request(requestData);

    expect(mockAxios.request).toHaveBeenCalledWith({
      url: requestData.url,
      method: requestData.method,
      data: requestData.body,
      headers: undefined,
    });

    expect(response).toEqual({
      statusCode: 201,
      body: { id: 1, name: "John" },
    });
  });

  it("should return the correct response when axios throws an error", async () => {
    const requestData: HttpRequest = {
      url: "https://api.example.com/data",
      method: "get",
    };

    const axiosError = {
      response: { status: 404, data: { message: "Not Found" } },
      isAxiosError: true,
    };

    mockAxios.request.mockRejectedValue(axiosError);

    const response = await httpClient.request(requestData);

    expect(response).toEqual({
      statusCode: 404,
      body: { message: "Not Found" },
    });
  });

  it("should return an unexpected error if it is not an axios error", async () => {
    const requestData: HttpRequest = {
      url: "https://api.example.com/data",
      method: "get",
    };

    const unknownError = new Error("Network Error");

    mockAxios.request.mockRejectedValueOnce(unknownError);

    const response = await httpClient.request(requestData);

    expect(response).toEqual({
      statusCode: 500,
      body: { message: "Network Error" },
    });
  });

  it("should return an unknown error if it is not a knowledge error", async () => {
    const requestData: HttpRequest = {
      url: "https://api.example.com/data",
      method: "get",
    };

    const unknownError = {};

    mockAxios.request.mockRejectedValueOnce(unknownError);

    const response = await httpClient.request(requestData);

    expect(response).toEqual({
      statusCode: 500,
      body: { message: "Unknown error" },
    });
  });
});
