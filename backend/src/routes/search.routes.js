/** @format */

const express = require("express");
const router = express.Router();
const Applicant = require("../models/Applicant");
const { getNeo4jSession } = require("../config/dbNeo4j");
const neo4j = require('neo4j-driver')

router.get("/", async (req, res) => {
	const {
		code,
		career,
		institution,
		subject,
		department,
		municipality,
		gender,
		passed,
		birth_year,
		admission_year,
		evaluation_number,
	} = req.query;

	const query = {};

	if (code?.trim()) query.applicant_code = code.trim();
	if (career?.trim()) query.target_career = career.trim();
	if (institution?.trim()) query.institution_type = institution.trim();
	if (subject?.trim()) query.subject = subject.trim();
	if (department?.trim()) query.institution_department = department.trim();
	if (municipality?.trim()) query.institution_municipality = municipality.trim();
	if (gender?.trim()) query.gender = gender.trim().toUpperCase();

	if (passed !== undefined) {
		if (passed === "true") query.passed = true;
		else if (passed === "false") query.passed = false;
	}

	if (birth_year && !isNaN(parseInt(birth_year))) {
		query.birth_year = parseInt(birth_year);
	}

	if (admission_year && !isNaN(parseInt(admission_year))) {
		query.admission_year = parseInt(admission_year);
	}

	if (evaluation_number && !isNaN(parseInt(evaluation_number))) {
		query.evaluation_number = parseInt(evaluation_number);
	}

	try {
		const data = await Applicant.find(query).limit(100);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/neo4j/graph", async (req, res) => {
	const session = getNeo4jSession();
	const limit = Math.floor(Number(req.query.limit)) || 10000;

	try {
		const result = await session.run(
			`
                MATCH (a:Applicant)-[r1:AIMS_FOR]->(c:Career)
                OPTIONAL MATCH (a)-[r2:STUDIED_AT]->(i:Institution)
                RETURN a, c, i
                LIMIT $limit
            `,
			{ limit: neo4j.int(limit) }
		);

		const nodesMap = new Map();
		const edges = [];

		result.records.forEach((record) => {
			const a = record.get("a").properties;
			const c = record.get("c")?.properties;
			const i = record.get("i")?.properties;

			nodesMap.set(`a-${a.code}`, { id: `a-${a.code}`, label: a.code, group: "Applicant" });

			if (c) {
				nodesMap.set(`c-${c.name}`, { id: `c-${c.name}`, label: c.name, group: "Career" });
				edges.push({ from: `a-${a.code}`, to: `c-${c.name}`, label: "AIMS_FOR" });
			}

			if (i) {
				const instId = `i-${i.type}-${i.department}-${i.municipality}`;
				const instLabel = `${i.type} - ${i.department} - ${i.municipality}`;
				nodesMap.set(instId, { id: instId, label: instLabel, group: "Institution" });
				edges.push({ from: `a-${a.code}`, to: instId, label: "STUDIED_AT" });
			}
		});

		const nodes = Array.from(nodesMap.values());

		res.json({ nodes, edges });
	} catch (err) {
		res.status(500).json({ error: err.message });
	} finally {
		await session.close();
	}
});

router.get("/careers", async (req, res) => {
	try {
		const data = await Applicant.distinct("target_career");
		res.json(data.sort());
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/institutions", async (req, res) => {
	try {
		const data = await Applicant.distinct("institution_type");
		res.json(data.sort());
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/codes", async (req, res) => {
	try {
		const data = await Applicant.distinct("applicant_code");
		res.json(data.slice(0, 100));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
