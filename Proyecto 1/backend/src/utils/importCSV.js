/** @format */

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Applicant = require("../models/Applicant");

const importCSV = async (filePath) => {
	return new Promise((resolve, reject) => {
		const results = [];
		const invalidEntries = [];

		const columns = {
			assignment_date: "fecha_asignacion",
			gender: "sexo",
			birth_year: "anio_nacimiento",
			subject: "materia",
			evaluation_number: "numero_de_fecha_de_evaluaci",
			admission_year: "anio_de_ingreso",
			passed: "aprobacion",
			target_career: "carrera_objetivo",
			institution_department: "departamento_institucion_ed",
			institution_municipality: "municipio_institucion_",
			institution_type: "tipo_institucion_educativa",
			applicant_code: "correlativo_aspirante",
		};

		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => {
				try {
					const mapped = {};

					for (const [key, column] of Object.entries(columns)) {
						const raw = row[column]?.toString().trim();

						if (!raw) {
							invalidEntries.push(row);
							return;
						}

						switch (key) {
							case "assignment_date":
								mapped[key] = new Date(raw);
								break;
							case "birth_year":
							case "evaluation_number":
							case "admission_year":
								const parsed = parseInt(raw);
								mapped[key] = isNaN(parsed) ? raw : parsed;
								break;
							case "passed":
								mapped[key] = raw.toUpperCase() === "APROBADO";
								break;
							default:
								mapped[key] = raw;
						}
					}

					results.push(mapped);
				} catch {
					invalidEntries.push(row);
				}
			})
			.on("end", async () => {
				try {
					if (results.length > 0) {
						await Applicant.insertMany(results);
					}

					if (invalidEntries.length > 0) {
						console.log("Filas ignoradas:");
						console.table(invalidEntries);

						const logsDir = path.join(__dirname, "../../logs");
						if (!fs.existsSync(logsDir)) {
							fs.mkdirSync(logsDir);
						}

						const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
						const fileName = `errores_importacion_${timestamp}.csv`;
						const fullPath = path.join(logsDir, fileName);

						const headers = Object.keys(invalidEntries[0]).join(",");
						const rows = invalidEntries.map((obj) => Object.values(obj).join(",")).join("\n");
						fs.writeFileSync(fullPath, headers + "\n" + rows);
					}

					resolve({
						inserted: results.length,
						ignored: invalidEntries.length,
					});
				} catch (err) {
					reject(err);
				}
			})
			.on("error", reject);
	});
};

module.exports = importCSV;
