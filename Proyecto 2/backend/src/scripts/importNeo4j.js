/** @format */

require("dotenv").config();
const importToNeo4j = require("../utils/importToNeo4j");

const file = process.argv[2];

if (!file) {
	console.error("You must provide a CSV file path");
	process.exit(1);
}

(async () => {
	try {
		const result = await importToNeo4j(file);
		console.log("Imported into Neo4j:", result);
		process.exit(0);
	} catch (err) {
		console.error("Error importing to Neo4j:", err);
		process.exit(1);
	}
})();