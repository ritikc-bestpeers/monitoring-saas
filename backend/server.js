import { CONFIG } from "./config/config.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";


import "./config/mongodb.js";
import "./config/queue.js";
import v1Routes from "./routes/index.route.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// parse application/json
app.use(bodyParser.json())

app.use(cors());
app.use(helmet());

app.use("/v1", apiLimiter, v1Routes)

app.listen(CONFIG.PORT, () => {
    console.log("App is running on port, ", CONFIG.PORT);
});