/** @format */

const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema({
	assignment_date: {
		type: Date,
		required: true,
	},
	gender: {
		type: String,
		enum: ["F", "M"],
		required: true,
	},
	birth_year: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	evaluation_number: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
	admission_year: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
	passed: {
		type: Boolean,
		required: true,
	},
	target_career: {
		type: String,
		required: true,
	},
	institution_department: {
		type: String,
		required: true,
	},
	institution_municipality: {
		type: String,
		required: true,
	},
	institution_type: {
		type: String,
		required: true,
	},
	applicant_code: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Applicant", ApplicantSchema);
