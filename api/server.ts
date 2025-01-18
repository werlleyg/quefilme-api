import "express-async-errors";
import express from "express";
// Routes
// import { routes } from "./routes";
// Interceptors
// import { errorInterceptor } from "./errors/errorInterceptor";
// config
import { AppConfig } from "../infra/config";

// Create express app
const app = express();

// Parse JSON
app.use(express.json());
// Use routes in app
// app.use(routes);
// Use interceptors in app
// app.use(errorInterceptor);
//  Start API
app.listen(AppConfig.PORT, () => {
  console.log(`[quefilme-api | Server started on port ${AppConfig.PORT}]`);
});
