/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/dbMongo");
const uploadRoute = require("./src/routes/upload.routes");
const queryRoutes = require("./src/routes/query.routes");
const searchRoutes = require("./src/routes/search.routes");
const redisRoutes = require("./src/routes/redis.routes");

const {
	register,
	httpRequestCounter,
	httpRequestDuration
} = require("./src/metrics");

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

connectDB();

app.use("/api/upload", uploadRoute);
app.use("/api/query", queryRoutes);
app.use("/api/search", searchRoutes);

app.use("/api-redis", (req, res, next) => {
	const end = httpRequestDuration.startTimer({
		method: req.method,
		endpoint: req.path
	});
	httpRequestCounter.inc({ method: req.method, endpoint: req.path });
	res.on("finish", () => end());
	next();
});

app.use("/api-redis", redisRoutes);

app.get("/metrics", async (req, res) => {
	res.set("Content-Type", register.contentType);
	res.end(await register.metrics());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
