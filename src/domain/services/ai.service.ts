export interface AiService {
  generateResponse: (params: AiService.Params) => Promise<AiService.Model>;
}

export namespace AiService {
  export type Params = string;
  export type Model = any;
}
