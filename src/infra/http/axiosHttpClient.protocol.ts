import axios, { AxiosResponse } from "axios";
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from "../../domain/protocols/http";

export class AxiosHttpClient implements HttpClient {
  async request(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers,
      });
    } catch (error) {
      if (axios?.isAxiosError(error) || error?.isAxiosError === true) {
        axiosResponse = error.response as AxiosResponse;
      } else {
        axiosResponse = error as AxiosResponse;
      }
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
