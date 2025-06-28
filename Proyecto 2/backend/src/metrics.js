/** @format */

const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const register = client.register;

const httpRequestCounter = new client.Counter({
	name: "api_requests_total",
	help: "Total de solicitudes HTTP recibidas",
	labelNames: ["method", "endpoint"],
});

const httpRequestDuration = new client.Histogram({
	name: "api_request_duration_seconds",
	help: "Duración de solicitudes HTTP en segundos",
	labelNames: ["method", "endpoint"],
});

const usersCreated = new client.Counter({
	name: "user_registrations_total",
	help: "Total de usuarios registrados",
});

const gamesCreated = new client.Counter({
	name: "games_created_total",
	help: "Total de juegos agregados",
});

const reviewsCreated = new client.Counter({
	name: "reviews_total",
	help: "Total de reseñas registradas",
});

module.exports = {
	register,
	httpRequestCounter,
	httpRequestDuration,
	usersCreated,
	gamesCreated,
	reviewsCreated,
};
