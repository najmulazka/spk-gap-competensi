
module.exports = {
  hitung: async (req, res) => {
    upload.single('file')(req, res, (err) => {
      let {
        aspekKapasitasIntelektualCS,
        aspekKapasitasIntelektualVI,
        aspekKapasitasIntelektualSB,
        aspekKapasitasIntelektualPSR,
        aspekKapasitasIntelektualKN,
        aspekKapasitasIntelektualLP,
        aspekKapasitasIntelektualFB,
        aspekKapasitasIntelektualIK,
        aspekKapasitasIntelektualANT,
        aspekKapasitasIntelektualIQ,
      } = req.body;
      // Tangani error dari multer
      if (err) {
        return res.status(400).json({
          status: false,
          message: err.message, // Pesan error dari multer
          data: null,
        });
      }

      // Jika tidak ada file yang di-upload
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: 'No file uploaded',
          data: null,
        });
      }

      // Tangani error saat memproses file Excel
      try {
        const filePath = req.file.path; // Path ke file yang diupload
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet); // Convert ke JSON

        console.log(sheet);

        res.status(200).json({
          status: true,
          message: 'File processed successfully',
          data,
        });
      } catch (err) {
        res.status(500).json({
          status: false,
          message: 'Error processing file',
          error: err.message,
          data: null,
        });
      }
    });
  },
};
