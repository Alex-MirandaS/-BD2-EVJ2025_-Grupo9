/** @format */

const express = require("express");
const router = express.Router();
const Applicant = require("../models/Applicant");

router.get("/by-institution-type", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{
				$group: {
					_id: "$institution_type",
					total: { $sum: 1 },
				},
			},
		]);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/passed-by-subject", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{ $match: { passed: true } },
			{
				$group: {
					_id: "$subject",
					total_passed: { $sum: 1 },
				},
			},
		]);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/passed-by-career-and-year", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{ $match: { passed: true } },
			{
				$group: {
					_id: {
						career: "$target_career",
						year: "$admission_year",
					},
					total_passed: { $sum: 1 },
				},
			},
			{
				$project: {
					career: "$_id.career",
					year: "$_id.year",
					total_passed: 1,
					_id: 0,
				},
			},
		]);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/passed-by-career-and-year", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{ $match: { passed: true } },
			{
				$group: {
					_id: {
						career: "$target_career",
						year: "$admission_year",
					},
					total_passed: { $sum: 1 },
				},
			},
			{
				$project: {
					career: "$_id.career",
					year: "$_id.year",
					total_passed: 1,
					_id: 0,
				},
			},
		]);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/approval-rate-by-subject", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{
				$group: {
					_id: "$subject",
					total: { $sum: 1 },
					passed: {
						$sum: {
							$cond: [{ $eq: ["$passed", true] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					subject: "$_id",
					approval_rate: {
						$round: [{ $multiply: [{ $divide: ["$passed", "$total"] }, 100] }, 2],
					},
					_id: 0,
				},
			},
		]);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/average-age-by-career", async (req, res) => {
	try {
		const currentYear = new Date().getFullYear();

		const data = await Applicant.aggregate([
			{
				$addFields: {
					age: {
						$cond: [{ $isNumber: "$birth_year" }, { $subtract: [currentYear, "$birth_year"] }, null],
					},
				},
			},
			{ $match: { age: { $ne: null } } },
			{
				$group: {
					_id: "$target_career",
					average_age: { $avg: "$age" },
				},
			},
			{
				$project: {
					career: "$_id",
					average_age: { $round: ["$average_age", 2] },
					_id: 0,
				},
			},
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/generate-career-summary", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{
				$group: {
					_id: "$target_career",
					total_applicants: { $sum: 1 },
					total_passed: {
						$sum: { $cond: [{ $eq: ["$passed", true] }, 1, 0] },
					},
				},
			},
			{
				$project: {
					career: "$_id",
					total_applicants: 1,
					total_passed: 1,
					approval_rate: {
						$round: [{ $multiply: [{ $divide: ["$total_passed", "$total_applicants"] }, 100] }, 2],
					},
					_id: 0,
				},
			},
			{
				$out: "career_summary",
			},
		]);

		res.json({ message: "Career summary collection created" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/average-age-by-career-and-institution", async (req, res) => {
	try {
		const currentYear = new Date().getFullYear();

		const data = await Applicant.aggregate([
			{ $match: { passed: true } },
			{
				$addFields: {
					age: {
						$cond: [{ $isNumber: "$birth_year" }, { $subtract: [currentYear, "$birth_year"] }, null],
					},
				},
			},
			{ $match: { age: { $ne: null } } },
			{
				$group: {
					_id: {
						career: "$target_career",
						institution: "$institution_type",
					},
					average_age: { $avg: "$age" },
				},
			},
			{
				$project: {
					career: "$_id.career",
					institution_type: "$_id.institution",
					average_age: { $round: ["$average_age", 2] },
					_id: 0,
				},
			},
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/passed-by-municipality-and-career", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{ $match: { passed: true } },
			{
				$group: {
					_id: {
						municipality: "$institution_municipality",
						career: "$target_career",
					},
					total_passed: { $sum: 1 },
				},
			},
			{
				$project: {
					municipality: "$_id.municipality",
					career: "$_id.career",
					total_passed: 1,
					_id: 0,
				},
			},
		]);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/evaluations-by-month-and-subject-public", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{ $match: { institution_type: "PUBLICO" } },
			{
				$addFields: {
					month: { $month: "$assignment_date" },
				},
			},
			{
				$group: {
					_id: {
						subject: "$subject",
						month: "$month",
					},
					total_evaluations: { $sum: 1 },
				},
			},
			{
				$project: {
					subject: "$_id.subject",
					month: "$_id.month",
					total_evaluations: 1,
					_id: 0,
				},
			},
		]);
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/top-demanded-careers-age-16-18", async (req, res) => {
	try {
		const currentYear = new Date().getFullYear();

		const data = await Applicant.aggregate([
			{
				$addFields: {
					age: {
						$cond: [{ $isNumber: "$birth_year" }, { $subtract: [currentYear, "$birth_year"] }, null],
					},
				},
			},
			{
				$match: {
					age: { $gte: 16, $lte: 18 },
				},
			},
			{
				$group: {
					_id: "$target_career",
					total_applicants: { $sum: 1 },
				},
			},
			{
				$sort: { total_applicants: -1 },
			},
			{
				$limit: 5,
			},
			{
				$project: {
					career: "$_id",
					total_applicants: 1,
					_id: 0,
				},
			},
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/performance-history/:applicantCode", async (req, res) => {
	try {
		const code = req.params.applicantCode;

		const data = await Applicant.aggregate([
			{ $match: { applicant_code: code } },
			{
				$group: {
					_id: "$subject",
					total_attempts: { $sum: 1 },
					passed_attempts: {
						$sum: { $cond: [{ $eq: ["$passed", true] }, 1, 0] },
					},
					results: {
						$push: {
							date: "$assignment_date",
							passed: "$passed",
							eval_number: "$evaluation_number",
						},
					},
				},
			},
			{
				$project: {
					subject: "$_id",
					total_attempts: 1,
					passed_attempts: 1,
					results: 1,
					_id: 0,
				},
			},
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/gender-distribution-by-institution-type", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{
				$group: {
					_id: {
						gender: "$gender",
						institution_type: "$institution_type",
					},
					total: { $sum: 1 },
				},
			},
			{
				$project: {
					gender: "$_id.gender",
					institution_type: "$_id.institution_type",
					total: 1,
					_id: 0,
				},
			},
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/approval-rate-by-age", async (req, res) => {
	try {
		const currentYear = new Date().getFullYear();

		const data = await Applicant.aggregate([
			{
				$addFields: {
					age: {
						$cond: [{ $isNumber: "$birth_year" }, { $subtract: [currentYear, "$birth_year"] }, null],
					},
				},
			},
			{ $match: { age: { $ne: null } } },
			{
				$group: {
					_id: "$age",
					total: { $sum: 1 },
					passed: {
						$sum: {
							$cond: [{ $eq: ["$passed", true] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					age: "$_id",
					approval_rate: {
						$round: [{ $multiply: [{ $divide: ["$passed", "$total"] }, 100] }, 2],
					},
					_id: 0,
				},
			},
			{ $sort: { age: 1 } },
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/average-attempts-by-subject", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{
				$group: {
					_id: "$subject",
					total_evaluations: { $sum: 1 },
					unique_applicants: { $addToSet: "$applicant_code" },
				},
			},
			{
				$project: {
					subject: "$_id",
					average_attempts: {
						$round: [{ $divide: ["$total_evaluations", { $size: "$unique_applicants" }] }, 2],
					},
					_id: 0,
				},
			},
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/full-history/:applicantCode", async (req, res) => {
	try {
		const code = req.params.applicantCode;

		const data = await Applicant.find({ applicant_code: code }).sort({ assignment_date: 1 });

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/most-failed-careers-on-first-attempt", async (req, res) => {
	try {
		const data = await Applicant.aggregate([
			{
				$match: {
					evaluation_number: 1,
					passed: false,
				},
			},
			{
				$group: {
					_id: "$target_career",
					total_failed: { $sum: 1 },
				},
			},
			{
				$sort: { total_failed: -1 },
			},
			{
				$project: {
					career: "$_id",
					total_failed: 1,
					_id: 0,
				},
			},
		]);

		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
