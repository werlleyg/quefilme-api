import { Router } from "express";
import { HealthCheckerController, MoviesController } from "./controllers";

const routes = Router();
const moviesRoutes = Router();
const moviesController = new MoviesController();
const checkHealthController = new HealthCheckerController();

moviesRoutes.get("/", moviesController.getMovies.bind(moviesController));
moviesRoutes.get("/:imdbId", moviesController.getMovie.bind(moviesController));
moviesRoutes.post(
  "/",
  moviesController.getMovieSuggestion.bind(moviesController),
);

routes.use("/movies", moviesRoutes);

// health check
routes.get(
  "/",
  checkHealthController.healthChecker.bind(checkHealthController),
);

export { routes };
