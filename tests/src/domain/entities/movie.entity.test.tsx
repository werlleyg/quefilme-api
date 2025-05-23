import { MovieEntity } from "../../../../src/domain/entities/movie.entity";

describe("MovieEntity", () => {
  describe("fromJson", () => {
    it("should create a valid MovieEntity instance with complete data", () => {
      const data = {
        Poster: "http://example.com/poster.jpg",
        imdbID: "tt1234567",
        Title: "Inception",
        Type: "movie",
        Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
        Plot: "A thief who enters people's dreams to steal secrets.",
        Genre: "Action, Sci-Fi",
        Year: "2010",
      };

      const movie = MovieEntity.fromJson(data);

      expect(movie).toBeInstanceOf(MovieEntity);
      expect(movie.image).toBe(data.Poster);
      expect(movie.imdbID).toBe(data.imdbID);
      expect(movie.title).toBe(data.Title);
      expect(movie.type).toBe(data.Type);
      expect(movie.actors).toBe(data.Actors);
      expect(movie.description).toBe(data.Plot);
      expect(movie.genre).toBe(data.Genre);
      expect(movie.runtime).toBe(data.Year);
    });

    it("should create an instance with undefined values when optional fields are missing", () => {
      const data = {
        Poster: "http://example.com/poster.jpg",
        imdbID: "tt1234567",
        Title: "Inception",
        Type: "movie",
      };

      const movie = MovieEntity.fromJson(data);

      expect(movie.actors).toBeUndefined();
      expect(movie.description).toBeUndefined();
      expect(movie.genre).toBeUndefined();
      expect(movie.runtime).toBeUndefined();
    });

    it("should handle an empty object correctly", () => {
      const movie = MovieEntity.fromJson({});

      expect(movie.image).toBeUndefined();
      expect(movie.imdbID).toBeUndefined();
      expect(movie.title).toBeUndefined();
      expect(movie.type).toBeUndefined();
      expect(movie.actors).toBeUndefined();
      expect(movie.description).toBeUndefined();
      expect(movie.genre).toBeUndefined();
      expect(movie.runtime).toBeUndefined();
    });

    it("should handle null or undefined input correctly", () => {
      const movieFromNull = MovieEntity.fromJson(null);
      const movieFromUndefined = MovieEntity.fromJson(undefined);

      expect(movieFromNull).toBeInstanceOf(MovieEntity);
      expect(movieFromUndefined).toBeInstanceOf(MovieEntity);

      expect(movieFromNull.image).toBeUndefined();
      expect(movieFromUndefined.image).toBeUndefined();
    });

    it("should handle unexpected data types without failing", () => {
      const data = {
        Poster: 12345,
        imdbID: true,
        Title: { key: "value" },
        Type: null,
        Actors: ["Leonardo DiCaprio"],
        Plot: undefined,
        Genre: Symbol("genre"),
        Year: NaN,
      };

      const movie = MovieEntity.fromJson(data);

      expect(movie.image).toBe(12345);
      expect(movie.imdbID).toBe(true);
      expect(movie.title).toEqual({ key: "value" });
      expect(movie.type).toBeNull();
      expect(movie.actors).toEqual(["Leonardo DiCaprio"]);
      expect(movie.description).toBeUndefined();
      expect(typeof movie.genre).toBe("symbol");
      expect(movie.runtime).toBeNaN();
    });
  });

  describe("MovieEntity getters", () => {
    const data = {
      title: "Inception",
      imdbID: "tt1234567",
      type: "movie",
      image: "http://example.com/poster.jpg",
      actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
      description: "A thief who enters people's dreams to steal secrets.",
      genre: "Action, Sci-Fi",
      runtime: "2010",
    };

    const movie = new MovieEntity(data);

    it("should return the correct values from getters", () => {
      expect(movie.title).toBe(data.title);
      expect(movie.imdbID).toBe(data.imdbID);
      expect(movie.type).toBe(data.type);
      expect(movie.image).toBe(data.image);
      expect(movie.actors).toBe(data.actors);
      expect(movie.description).toBe(data.description);
      expect(movie.genre).toBe(data.genre);
      expect(movie.runtime).toBe(data.runtime);
    });
  });

  describe("toJSON", () => {
    it("should return a JSON object with the same values as the entity", () => {
      const data = {
        title: "Inception",
        imdbID: "tt1234567",
        type: "movie",
        image: "http://example.com/poster.jpg",
        actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
        description: "A thief who enters people's dreams to steal secrets.",
        genre: "Action, Sci-Fi",
        runtime: "2010",
      };

      const movie = new MovieEntity(data);
      expect(movie.toJSON).toEqual(data);
    });
  });
});
