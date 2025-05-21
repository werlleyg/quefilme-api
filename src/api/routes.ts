import { Router } from "express";
import { MoviesController } from "./controllers";

const routes = Router();
const moviesRoutes = Router();
const moviesController = new MoviesController();

moviesRoutes.get("/", moviesController.getMovies.bind(moviesController));
moviesRoutes.get("/:imdbId", moviesController.getMovie.bind(moviesController));
moviesRoutes.post(
  "/",
  moviesController.getMovieSuggestion.bind(moviesController),
);

routes.use("/movies", moviesRoutes);

export { routes };
