const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = 3000;
const xlsx = require('xlsx');
const upload = require('./middlewares/multer.middlewares'); // Middleware multer
const path = require('path');
const { hitung } = require('./controllers/hitung.controllers');

app.use(morgan('dev'));
app.use(express.json());

// Router index
app.get('/', (req, res) => {
  return res.status(200).json({ status: true, message: 'Welcome to techacademy app', err: null, data: null });
});

// Route upload file
app.post('/upload', (req, res) => {
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
      aspekSikapKerjaEP,
      aspekSikapKerjaKTJ,
      aspekSikapKerjaKH,
      aspekSikapKerjaPP,
      aspekSikapKerjaDB,
      aspekSikapKerjaVP,
      aspekPerilakuD,
      aspekPerilakuI,
      aspekPerilakuS,
      aspekPerilakuC,
      kolomKapasitasIntelektualCF1,
      kolomKapasitasIntelektualCF2,
      kolomKapasitasIntelektualCF3,
      kolomKapasitasIntelektualCF4,
      kolomKapasitasIntelektualCF5,
      kolomSikapKerjaCF1,
      kolomSikapKerjaCF2,
      kolomSikapKerjaCF3,
      kolomPerilakuCF1,
      kolomPerilakuCF2,
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
      const kapasitasIntelektual = workbook.SheetNames[0]; // Ambil sheet pertama
      const sikapKerja = workbook.SheetNames[1]; // Ambil sheet kedua
      const perilaku = workbook.SheetNames[2]; // Ambil sheet kedua
      const sheetKapasitasIntelektual = workbook.Sheets[kapasitasIntelektual];
      const sheetSikapKerja = workbook.Sheets[sikapKerja];
      const sheetPerilaku = workbook.Sheets[perilaku];
      const dataKapasitasIntelektual = xlsx.utils.sheet_to_json(sheetKapasitasIntelektual); // Convert ke JSON
      const dataSikapKerja = xlsx.utils.sheet_to_json(sheetSikapKerja); // Convert ke JSON
      const dataPerilaku = xlsx.utils.sheet_to_json(sheetPerilaku); // Convert ke JSON

      let gapKapasitasIntelektual = dataKapasitasIntelektual.map((item) => {
        let Id_Karyawan = item.Id_Karyawan;
        let gapCS = item.CS - Number(aspekKapasitasIntelektualCS);
        let gapVI = item.VI - Number(aspekKapasitasIntelektualVI);
        let gapSB = item.SB - Number(aspekKapasitasIntelektualSB);
        let gapPSR = item.PSR - Number(aspekKapasitasIntelektualPSR);
        let gapKN = item.KN - Number(aspekKapasitasIntelektualKN);
        let gapLP = item.LP - Number(aspekKapasitasIntelektualLP);
        let gapFB = item.FB - Number(aspekKapasitasIntelektualFB);
        let gapIK = item.IK - Number(aspekKapasitasIntelektualIK);
        let gapANT = item.ANT - Number(aspekKapasitasIntelektualANT);
        let gapIQ = item.IQ - Number(aspekKapasitasIntelektualIQ);
        return {
          Id_Karyawan,
          gapCS,
          gapVI,
          gapSB,
          gapPSR,
          gapKN,
          gapLP,
          gapFB,
          gapIK,
          gapANT,
          gapIQ,
        };

        // console.log(`${item.Id_Karyawan} = ${gapCS} ${gapVI} ${gapSB} ${gapPSR} ${gapKN} ${gapLP} ${gapFB} ${gapIK} ${gapANT} ${gapIQ}`);
      });

      let gapSikapKerja = dataSikapKerja.map((item) => {
        let Id_Karyawan = item.Id_Karyawan;
        let gapEP = item.EP - Number(aspekSikapKerjaEP);
        let gapKTJ = item.KTJ - Number(aspekSikapKerjaKTJ);
        let gapKH = item.KH - Number(aspekSikapKerjaKH);
        let gapPP = item.PP - Number(aspekSikapKerjaPP);
        let gapDB = item.DB - Number(aspekSikapKerjaDB);
        let gapVP = item.VP - Number(aspekSikapKerjaVP);

        return {
          Id_Karyawan,
          gapEP,
          gapKTJ,
          gapKH,
          gapPP,
          gapDB,
          gapVP,
        };
      });

      let gapPerilaku = dataPerilaku.map((item) => {
        let Id_Karyawan = item.Id_Karyawan;
        let gapD = item.D - Number(aspekPerilakuD);
        let gapI = item.I - Number(aspekPerilakuI);
        let gapS = item.S - Number(aspekPerilakuS);
        let gapC = item.C - Number(aspekPerilakuC);

        return {
          Id_Karyawan,
          gapD,
          gapI,
          gapS,
          gapC,
        };
      });

      const calculationBobot = (gap) => {
        switch (gap) {
          case 0:
            return 5;
            break;
          case 1:
            return 4.5;
            break;
          case -1:
            return 4;
            break;
          case 2:
            return 3.5;
            break;
          case -2:
            return 3;
            break;
          case 3:
            return 2.5;
            break;
          case -3:
            return 2;
            break;
          case 4:
            return 1.5;
            break;
          case -4:
            return 1;
            break;

          default:
            throw new Error('terjadi kesalahan pada data');
        }
      };

      let bobotKapasitasIntelektual = gapKapasitasIntelektual.map((item) => {
        return {
          Id_Karyawan: item.Id_Karyawan,
          bobotCS: calculationBobot(item.gapCS),
          bobotVI: calculationBobot(item.gapVI),
          bobotSB: calculationBobot(item.gapSB),
          bobotPSR: calculationBobot(item.gapPSR),
          bobotKN: calculationBobot(item.gapKN),
          bobotLP: calculationBobot(item.gapLP),
          bobotFB: calculationBobot(item.gapFB),
          bobotIK: calculationBobot(item.gapIK),
          bobotANT: calculationBobot(item.gapANT),
          bobotIQ: calculationBobot(item.gapIQ),
        };
      });

      let bobotSikapKerja = gapSikapKerja.map((item) => {
        return {
          Id_Karyawan: item.Id_Karyawan,
          bobotEP: calculationBobot(item.gapEP),
          bobotKT: calculationBobot(item.gapKTJ),
          bobotKH: calculationBobot(item.gapKH),
          bobotPP: calculationBobot(item.gapPP),
          bobotDB: calculationBobot(item.gapDB),
          bobotVP: calculationBobot(item.gapVP),
        };
      });

      let bobotPerilaku = gapPerilaku.map((item) => {
        return {
          Id_Karyawan: item.Id_Karyawan,
          bobotD: calculationBobot(item.gapD),
          bobotI: calculationBobot(item.gapI),
          bobotS: calculationBobot(item.gapS),
          bobotC: calculationBobot(item.gapC),
        };
      });

      // Fungsi untuk menghitung core factor
      const calculateCoreFactor = (item, selectedColumns) => {
        const totalCoreFactor = selectedColumns.reduce((sum, column) => sum + item[column], 0);
        const coreFactor = totalCoreFactor / selectedColumns.length;
        return coreFactor;
      };

      const calculateSecondFactor = (item, excludedColumns) => {
        const includedColumns = Object.keys(item).filter((column) => !excludedColumns.includes(column) && column !== 'Id_Karyawan');
        const totalSecondFactor = includedColumns.reduce((sum, column) => sum + item[column], 0);
        const secondFactor = totalSecondFactor / includedColumns.length;
        return secondFactor;
      };

      let CFSFKapasitasIntelektual = bobotKapasitasIntelektual.map((item) => {
        let Id_Karyawan = item.Id_Karyawan;
        let CF = calculateCoreFactor(item, [kolomKapasitasIntelektualCF1, kolomKapasitasIntelektualCF2, kolomKapasitasIntelektualCF3, kolomKapasitasIntelektualCF4, kolomKapasitasIntelektualCF5]);
        let SC = calculateSecondFactor(item, [kolomKapasitasIntelektualCF1, kolomKapasitasIntelektualCF2, kolomKapasitasIntelektualCF3, kolomKapasitasIntelektualCF4, kolomKapasitasIntelektualCF5]);
        return {
          Id_Karyawan,
          coreFactor: CF,
          secondFactor: SC,
        };
      });

      let CFSFSikapKerja = bobotSikapKerja.map((item) => {
        let Id_Karyawan = item.Id_Karyawan;
        let CF = calculateCoreFactor(item, [kolomSikapKerjaCF1, kolomSikapKerjaCF2, kolomSikapKerjaCF3]);
        let SC = calculateSecondFactor(item, [kolomSikapKerjaCF1, kolomSikapKerjaCF2, kolomSikapKerjaCF3]);
        return {
          Id_Karyawan,
          coreFactor: CF,
          secondFactor: SC,
        };
      });

      let CFSFPerilaku = bobotPerilaku.map((item) => {
        let Id_Karyawan = item.Id_Karyawan;
        let CF = calculateCoreFactor(item, [kolomPerilakuCF1, kolomPerilakuCF2]);
        let SC = calculateSecondFactor(item, [kolomPerilakuCF1, kolomPerilakuCF2]);
        return {
          Id_Karyawan,
          coreFactor: CF,
          secondFactor: SC,
        };
      });

      res.status(200).json({
        status: true,
        message: 'File processed successfully',
        data: {
          CFSFKapasitasIntelektual,
          CFSFSikapKerja,
          CFSFPerilaku,
        },
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
});

// Jalankan server
app.listen(PORT, () => console.log('Running on port', PORT));
