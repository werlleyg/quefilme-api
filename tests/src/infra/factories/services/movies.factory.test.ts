import { AppConfig } from "../../../../../src/infra/config";
import { makeAxiosHttpClient } from "../../../../../src/infra/factories/http/axiosHttpClient.factory";
import { makeMoviesService } from "../../../../../src/infra/factories/services/movies.factory";
import { MoviesServiceImpl } from "../../../../../src/infra/services/moviesImpl.service";

jest.mock(
  "../../../../../src/infra/factories/http/axiosHttpClient.factory",
  () => ({
    makeAxiosHttpClient: jest.fn(),
  }),
);

jest.mock("../../../../../src/infra/config", () => ({
  AppConfig: {
    BASE_URL_MOVIES_SERVICE: "http://mock-movies-url.com",
    ACCESS_KEY_MOVIES_SERVICE: "mock-access-key",
  },
}));

describe("makeMoviesService", () => {
  it("should return a MoviesServiceImpl instance", () => {
    // Arrange
    const mockHttpClient = { get: jest.fn(), post: jest.fn() }; // Mock do cliente HTTP
    (makeAxiosHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

    // Act
    const moviesService = makeMoviesService();

    // Assert
    expect(moviesService).toBeInstanceOf(MoviesServiceImpl);
  });

  it("should pass the correct params to MoviesServiceImpl constructor ", () => {
    // Arrange
    const mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      request: jest.fn(),
    }; // Mock
    (makeAxiosHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

    // Act
    const moviesService = makeMoviesService();

    // Assert
    expect(makeAxiosHttpClient).toHaveBeenCalled();
    expect(moviesService).toEqual(
      new MoviesServiceImpl(
        mockHttpClient,
        AppConfig.BASE_URL_MOVIES_SERVICE,
        AppConfig.ACCESS_KEY_MOVIES_SERVICE,
      ),
    );
  });
});
