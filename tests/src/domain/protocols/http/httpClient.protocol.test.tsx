import { HttpStatusCodeEnum } from "../../../../../src/domain/enums";
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from "../../../../../src/domain/protocols/http";

describe("HttpClient", () => {
  class MockHttpClient extends HttpClient {
    request = jest.fn((data: HttpRequest): Promise<HttpResponse> => {
      return Promise.resolve({
        statusCode: HttpStatusCodeEnum.ok,
        body: { message: "Success" },
      });
    });
  }

  describe("HttpRequest", () => {
    it("should create an HttpRequest with all properties", () => {
      const request: HttpRequest = {
        url: "https://example.com",
        method: "get",
        body: { key: "value" },
        headers: { Authorization: "Bearer token" },
      };

      expect(request.url).toBe("https://example.com");
      expect(request.method).toBe("get");
      expect(request.body).toEqual({ key: "value" });
      expect(request.headers).toEqual({ Authorization: "Bearer token" });
    });

    it("should create an HttpRequest with only required properties", () => {
      const request: HttpRequest = {
        url: "https://example.com",
        method: "post",
      };

      expect(request.url).toBe("https://example.com");
      expect(request.method).toBe("post");
      expect(request.body).toBeUndefined();
      expect(request.headers).toBeUndefined();
    });
  });

  describe("HttpResponse", () => {
    it("should create a HttpResponse with statusCode and body", () => {
      const response: HttpResponse = {
        statusCode: HttpStatusCodeEnum.ok,
        body: { message: "Success" },
      };

      expect(response.statusCode).toBe(HttpStatusCodeEnum.ok);
      expect(response.body).toEqual({ message: "Success" });
    });

    it("should create a HttpResponse with only statusCode", () => {
      const response: HttpResponse = {
        statusCode: HttpStatusCodeEnum.noContent,
      };

      expect(response.statusCode).toBe(HttpStatusCodeEnum.noContent);
      expect(response.body).toBeUndefined();
    });
  });

  describe("HttpClient", () => {
    it("should create an instance of HttpClient", () => {
      const client = new MockHttpClient();
      expect(client).toBeInstanceOf(HttpClient);
    });

    it("should make a request and return a valid response", async () => {
      const client = new MockHttpClient();
      const requestData: HttpRequest = {
        url: "https://example.com",
        method: "get",
      };

      const response = await client.request(requestData);

      expect(response.statusCode).toBe(HttpStatusCodeEnum.ok);
      expect(response.body).toEqual({ message: "Success" });
    });
  });
});
