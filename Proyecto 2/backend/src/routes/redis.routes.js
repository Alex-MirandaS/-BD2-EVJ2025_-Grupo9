/** @format */

const express = require("express");
const router = express.Router();
const redis = require("../config/dbRedis.js");

router.post("/user", async (req, res) => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({ error: "username, email y password son obligatorios." });
		}

		const userId = await redis.get(`user_email:${email}`);

		if (userId) {
			return res.status(200).json({
				message: "El usuario ya existe con ese correo",
				user_id: userId,
			});
		}

		const newUserId = await redis.incr("user:id");

		const password_hash = password;

		await redis.hSet(`user:${newUserId}`, {
			username,
			email,
			password_hash,
		});

		await redis.set(`user_email:${email}`, newUserId);

		res.status(201).json({ message: "Usuario creado", user_id: newUserId });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.post("/game", async (req, res) => {
	try {
		const { title, genre, developer } = req.body;

		if (!title || !genre || !developer) {
			return res.status(400).json({ error: "title, genre y developer son obligatorios." });
		}

		const gameId = await redis.incr("game:id");

		await redis.hSet(`game:${gameId}`, {
			title,
			genre,
			developer,
		});

		res.status(201).json({ message: "Juego creado", game_id: gameId });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.post("/review", async (req, res) => {
	try {
		const { user_id, game_id, score, comment } = req.body;

		if (!user_id || !game_id || !score || !comment) {
			return res.status(400).json({ error: "user_id, game_id, score y comment son obligatorios." });
		}

		const existing = await redis.get(`review_by_user:${user_id}:${game_id}`);

		if (existing) {
			return res.status(400).json({ error: "Ya existe una reseña para este juego por este usuario." });
		}

		const reviewId = await redis.incr("review:id");

		await redis.hSet(`review:${reviewId}`, {
			user_id,
			game_id,
			score,
			comment,
			timestamp: Date.now(),
		});

		await redis.set(`review_by_user:${user_id}:${game_id}`, reviewId);

		res.status(201).json({ message: "Reseña creada", review_id: reviewId });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.delete("/review/:id", async (req, res) => {
	try {
		const reviewId = req.params.id;

		const review = await redis.hGetAll(`review:${reviewId}`);

		if (!review || Object.keys(review).length === 0) {
			return res.status(404).json({ error: "La reseña no existe." });
		}

		await redis.del(`review:${reviewId}`);
		await redis.del(`review_by_user:${review.user_id}:${review.game_id}`);

		res.status(200).json({ message: "Reseña eliminada", review_id: reviewId });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.delete("/user/:id", async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await redis.hGetAll(`user:${userId}`);

		if (!user || Object.keys(user).length === 0) {
			return res.status(404).json({ error: "El usuario no existe." });
		}

		await redis.del(`user:${userId}`);
		await redis.del(`user_email:${user.email}`);

		res.status(200).json({ message: "Usuario eliminado", user_id: userId });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.delete("/game/:id", async (req, res) => {
	try {
		const gameId = req.params.id;

		const game = await redis.hGetAll(`game:${gameId}`);

		if (!game || Object.keys(game).length === 0) {
			return res.status(404).json({ error: "El juego no existe." });
		}

		await redis.del(`game:${gameId}`);

		res.status(200).json({ message: "Juego eliminado", game_id: gameId });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/game/:id", async (req, res) => {
	try {
		const gameId = req.params.id;

		const game = await redis.hGetAll(`game:${gameId}`);

		if (!game || Object.keys(game).length === 0) {
			return res.status(404).json({ error: "El juego no existe." });
		}

		res.status(200).json({ game_id: gameId, ...game });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/user/:id", async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await redis.hGetAll(`user:${userId}`);

		if (!user || Object.keys(user).length === 0) {
			return res.status(404).json({ error: "El usuario no existe." });
		}

		res.status(200).json({ user_id: userId, ...user });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/review/:id", async (req, res) => {
	try {
		const reviewId = req.params.id;

		const review = await redis.hGetAll(`review:${reviewId}`);

		if (!review || Object.keys(review).length === 0) {
			return res.status(404).json({ error: "La reseña no existe." });
		}

		res.status(200).json({ review_id: reviewId, ...review });
	} catch (err) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/reviews/user/:id", async (req, res) => {
	try {
		const userId = req.params.id;

		const keys = await redis.keys("review:*");
		const reviews = [];

		for (const key of keys) {
			const keyType = await redis.type(key);
			if (keyType !== "hash") continue;

			const review = await redis.hGetAll(key);
			if (review.user_id === userId) {
				const review_id = key.split(":")[1];
				reviews.push({ review_id, ...review });
			}
		}

		res.status(200).json(reviews);
	} catch (err) {
		console.error("Error al obtener reseñas del usuario:", err);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/reviews/game/:id", async (req, res) => {
	try {
		const gameId = req.params.id;

		const keys = await redis.keys("review:*");
		const reviews = [];

		for (const key of keys) {
			const keyType = await redis.type(key);
			if (keyType !== "hash") continue;

			const review = await redis.hGetAll(key);
			if (review.game_id === gameId) {
				const review_id = key.split(":")[1];
				reviews.push({ review_id, ...review });
			}
		}

		res.status(200).json(reviews);
	} catch (err) {
		console.error("Error al obtener reseñas del juego:", err);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/games", async (req, res) => {
	try {
		const keys = await redis.keys("game:*");
		const games = [];

		for (const key of keys) {
			const keyType = await redis.type(key);
			if (keyType !== "hash") continue;

			const game = await redis.hGetAll(key);
			const game_id = key.split(":")[1];
			games.push({ game_id, ...game });
		}

		res.status(200).json(games);
	} catch (err) {
		console.error("Error al obtener juegos:", err);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/users", async (req, res) => {
	try {
		const keys = await redis.keys("user:*");
		const users = [];

		for (const key of keys) {
			const keyType = await redis.type(key);
			if (keyType !== "hash") continue;

			const user = await redis.hGetAll(key);
			const user_id = key.split(":")[1];
			users.push({ user_id, ...user });
		}

		res.status(200).json(users);
	} catch (err) {
		console.error("Error al obtener usuarios:", err);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.get("/reviews", async (req, res) => {
	try {
		const keys = await redis.keys("review:*");
		const reviews = [];

		for (const key of keys) {
			const keyType = await redis.type(key);
			if (keyType !== "hash") continue;

			const review = await redis.hGetAll(key);
			const review_id = key.split(":")[1];
			reviews.push({ review_id, ...review });
		}

		res.status(200).json(reviews);
	} catch (err) {
		console.error("Error al obtener reseñas:", err);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

module.exports = router;
