const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const client = require("prom-client");
const path = require("path");

const userRoutes = require("./src/database/routes/userRoutes");
const coordinatorRoutes = require("./src/database/routes/coordinatorRoutes");
const imageRoutes = require("./src/database/routes/imageRoutes");

const app = express();
const port = 3000;

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationMilliseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 5, 15, 50, 100, 500],
  registers: [register],
});

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMilliseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use("/img", express.static(path.join(__dirname, "src/database/images")));

// Define routes
app.use("/user", userRoutes);
app.use("/coordinator/upload", imageRoutes);
app.use("/coordinator", coordinatorRoutes);

// Define the metrics route
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
