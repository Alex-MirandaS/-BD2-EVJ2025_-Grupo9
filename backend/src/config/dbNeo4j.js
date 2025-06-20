/** @format */

const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
	process.env.NEO4J_URI,
	neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getNeo4jSession = () => driver.session({ database: "neo4j" });

module.exports = { driver, getNeo4jSession };