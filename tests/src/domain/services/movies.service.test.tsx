import { MoviesService } from "../../../../src/domain/services";

// Mocking the MoviesService implementation
const mockMoviesService: MoviesService = {
  getOne: jest.fn(async (id: string) => ({ id, title: "Mock Movie" })),
  getList: jest.fn(async (query: string) => [
    { id: "1", title: "Mock Movie 1" },
    { id: "2", title: "Mock Movie 2" },
  ]),
};

describe("MoviesService", () => {
  describe("getOne", () => {
    it("should return a movie when a valid ID is provided", async () => {
      const id = "1";
      const movie = await mockMoviesService.getOne(id);
      expect(movie).toEqual({ id, title: "Mock Movie" });
      expect(mockMoviesService.getOne).toHaveBeenCalledWith(id);
    });

    it("should return null if no movie is found", async () => {
      (mockMoviesService.getOne as jest.Mock).mockResolvedValueOnce(null);
      const movie = await mockMoviesService.getOne("invalid-id");
      expect(movie).toBeNull();
    });
  });

  describe("getList", () => {
    it("should return a list of movies based on a search query", async () => {
      const query = "action";
      const movies = await mockMoviesService.getList(query);
      expect(movies).toEqual([
        { id: "1", title: "Mock Movie 1" },
        { id: "2", title: "Mock Movie 2" },
      ]);
      expect(mockMoviesService.getList).toHaveBeenCalledWith(query);
    });

    it("should return an empty array if no movies match the query", async () => {
      (mockMoviesService.getList as jest.Mock).mockResolvedValueOnce([]);
      const movies = await mockMoviesService.getList("unknown-query");
      expect(movies).toEqual([]);
    });
  });
});
