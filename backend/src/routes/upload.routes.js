/** @format */

const express = require("express");
const multer = require("multer");
const importCSV = require("../utils/importCSV");
const importToNeo4j = require("../utils/importToNeo4j");
const { getNeo4jSession } = require("../config/dbNeo4j");
const fs = require("fs");
const path = require("path");
const { db } = require("../models/Applicant");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
	const filePath = req.file.path;

	try {
		const result = await importCSV(filePath);
		fs.unlinkSync(filePath);
		res.status(200).json({ message: "Carga exitosa", ...result, db: "MongoDB" });
	} catch (error) {
		fs.unlinkSync(filePath);
		res.status(500).json({ error: "Error al procesar el archivo CSV", detail: error.message });
	}
});

router.post("/neo4j", upload.single("file"), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const filePath = req.file.path;

	try {
		const result = await importToNeo4j(filePath);
		fs.unlinkSync(filePath);
		res.status(200).json({ message: "Carga exitosa en Neo4j", ...result, db: "Neo4j" });
	} catch (error) {
		fs.unlinkSync(filePath);
		res.status(500).json({ error: "Error al procesar archivo para Neo4j", detail: error.message });
	}
});

router.delete("/neo4j/clear", async (req, res) => {
	const session = getNeo4jSession();

	try {
		const countResult = await session.run("MATCH (n) RETURN count(n) AS total");
		const total = countResult.records[0].get("total").toInt();

		await session.run("MATCH (n) DETACH DELETE n");

		res.status(200).json({
			message: "All Neo4j data deleted successfully",
			deleted_nodes: total,
		});
	} catch (err) {
		res.status(500).json({ error: "Failed to delete data from Neo4j", detail: err.message });
	} finally {
		await session.close();
	}
});

module.exports = router;
