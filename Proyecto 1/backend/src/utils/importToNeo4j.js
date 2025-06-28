/** @format */

const fs = require("fs");
const csv = require("csv-parser");
const { getNeo4jSession } = require("../config/dbNeo4j");

const importToNeo4j = async (filePath) => {
	return new Promise((resolve, reject) => {
		const session = getNeo4jSession();
		const rows = [];
		let processed = 0;
		let skipped = 0;
		const BATCH_SIZE = 150;

		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => {
				rows.push(row);
			})
			.on("end", async () => {
				try {
					let tx = session.beginTransaction();

					for (const [i, row] of rows.entries()) {
						const applicantCode = row.correlativo_aspirante?.trim();
						const career = row.carrera_objetivo?.trim();
						const institutionType = row.tipo_institucion_educativa?.trim();
						const department = row.departamento_institucion_ed?.trim();
						const municipality = row.municipio_institucion_?.trim();

						if (!applicantCode || !career || !institutionType || !department || !municipality) {
							skipped++;
							continue;
						}

						await tx.run(
							`
              MERGE (a:Applicant {code: $code})
              MERGE (c:Career {name: $career})
              MERGE (i:Institution {type: $type, department: $department, municipality: $municipality})
              MERGE (a)-[:AIMS_FOR]->(c)
              MERGE (a)-[:STUDIED_AT]->(i)
              `,
							{
								code: applicantCode,
								career,
								type: institutionType,
								department,
								municipality,
							}
						);

						processed++;

						if (processed % BATCH_SIZE === 0) {
							await tx.commit();
							console.log(`Procesadas ${processed} filas`);
							tx = session.beginTransaction();
						}
					}

					if (processed % BATCH_SIZE !== 0) {
						await tx.commit();
					}

					console.log("Importación completada");
					console.log(`Total: ${rows.length}, Insertadas: ${processed}, Ignoradas: ${skipped}`);

					resolve({ total: rows.length, inserted: processed, skipped });
				} catch (err) {
					reject(err);
				} finally {
					await session.close();
				}
			})
			.on("error", reject);
	});
};

module.exports = importToNeo4j;
