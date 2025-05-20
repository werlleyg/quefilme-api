import { AxiosHttpClient } from "../../http/axiosHttpClient.protocol";

export const makeAxiosHttpClient = (): AxiosHttpClient => new AxiosHttpClient();
