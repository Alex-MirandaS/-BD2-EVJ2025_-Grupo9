const express = require('express');
const multer = require('multer');
const importCSV = require('../utils/importCSV');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const result = await importCSV(filePath);
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'Carga exitosa', ...result });
  } catch (error) {
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Error al procesar el archivo CSV', detail: error.message });
  }
});

module.exports = router;