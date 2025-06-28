/** @format */

require("dotenv").config();
const connectDB = require("../config/db");
const importCSV = require("../utils/importCSV");

const filePath = process.argv[2];

if (!filePath) {
	console.error("Debes proporcionar un archivo CSV");
	process.exit(1);
}

(async () => {
	try {
		await connectDB();
		const result = await importCSV(filePath);
		console.log("Carga completa:", result);
		process.exit(0);
	} catch (err) {
		console.error("Error al importar:", err);
		process.exit(1);
	}
})();
