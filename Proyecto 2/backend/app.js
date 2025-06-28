/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/dbMongo");
const uploadRoute = require("./src/routes/upload.routes");
const queryRoutes = require("./src/routes/query.routes");
const searchRoutes = require("./src/routes/search.routes");
const redisRoutes = require("./src/routes/redis.routes");

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

connectDB();

app.use("/api/upload", uploadRoute);
app.use("/api/query", queryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api-redis", redisRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
