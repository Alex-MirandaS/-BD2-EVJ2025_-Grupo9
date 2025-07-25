/** @format */

const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Conectado a MongoDB Atlas");
	} catch (err) {
		console.error("Error al conectar con MongoDB:", err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
