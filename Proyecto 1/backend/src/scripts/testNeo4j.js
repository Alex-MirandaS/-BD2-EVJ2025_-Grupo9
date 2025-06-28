/** @format */

require("dotenv").config();
const { driver } = require("../config/dbNeo4j");

(async () => {
	try {
		const info = await driver.getServerInfo();
		console.log("✅ Connected to Neo4j");
		console.log(info);
	} catch (err) {
		console.error("❌ Connection failed:", err);
	} finally {
		await driver.close();
	}
})();
