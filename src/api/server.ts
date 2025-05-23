import "express-async-errors";
import express from "express";
import helmet from "helmet";
import cors from "cors";

// Routes
import { routes } from "./routes";
// config
import { AppConfig } from "../infra/config";
// Interceptors
import { errorInterceptor } from "../infra/shared/errorInterceptor.shared";

// Create express app
const app = express();
// Security middleware
app.use(helmet());
app.use(cors());
// Parse JSON
app.use(express.json());
// Use routes in app
app.use(routes);
// Use interceptors in app
app.use(errorInterceptor.bind(this));
//  Start API
app.listen(AppConfig.PORT, () => {
  console.log(`[quefilme-api | Server started on port ${AppConfig.PORT}]`);
});

export default app;
