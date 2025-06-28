/** @format */

const { createClient } = require("redis");

const client = createClient({
	username: "default",
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
	},
});

client.on("error", (err) => {
	console.error("Redis Client Error:", err);
});

client.on("connect", () => {
	console.log("Conectado a Redis.");
});

client.connect();

module.exports = client;
