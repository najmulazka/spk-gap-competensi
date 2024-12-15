const xlsx = require('xlsx');
const upload = require('../middlewares/multer.middlewares');
const fs = require('fs');
// const path = require('path');

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
        kapasitasIntelektualCF,
        sikapKerjaCF,
        perilakuCF,
        prosentaseCF,
        prosentaseSF,
        prosentaseKapasitasIntelektual,
        prosentaseSikapKerja,
        prosentasePerilaku,
      } = req.body;

      // Tangani error multer
      if (err) {
        return res.status(400).json({
          status: false,
          message: err.message,
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
        const kapasitasIntelektual = workbook.SheetNames[0];
        const sikapKerja = workbook.SheetNames[1];
        const perilaku = workbook.SheetNames[2];
        const sheetKapasitasIntelektual = workbook.Sheets[kapasitasIntelektual];
        const sheetSikapKerja = workbook.Sheets[sikapKerja];
        const sheetPerilaku = workbook.Sheets[perilaku];
        const dataKapasitasIntelektual = xlsx.utils.sheet_to_json(sheetKapasitasIntelektual); // Convert ke JSON
        const dataSikapKerja = xlsx.utils.sheet_to_json(sheetSikapKerja);
        const dataPerilaku = xlsx.utils.sheet_to_json(sheetPerilaku);

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
            bobotKTJ: calculationBobot(item.gapKTJ),
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

        kapasitasIntelektualCF = JSON.parse(kapasitasIntelektualCF);
        let kolomKapasitasIntelektualCF = kapasitasIntelektualCF.map((item) => item.cf);

        let CFSFKapasitasIntelektual = bobotKapasitasIntelektual.map((item) => {
          let Id_Karyawan = item.Id_Karyawan;
          let CF = calculateCoreFactor(item, kolomKapasitasIntelektualCF);
          let SC = calculateSecondFactor(item, kolomKapasitasIntelektualCF);
          return {
            Id_Karyawan,
            coreFactor: CF,
            secondFactor: SC,
          };
        });

        sikapKerjaCF = JSON.parse(sikapKerjaCF);
        let kolomSikapKerjaCF = sikapKerjaCF.map((item) => item.cf);

        let CFSFSikapKerja = bobotSikapKerja.map((item) => {
          let Id_Karyawan = item.Id_Karyawan;
          let CF = calculateCoreFactor(item, kolomSikapKerjaCF);
          let SC = calculateSecondFactor(item, kolomSikapKerjaCF);
          return {
            Id_Karyawan,
            coreFactor: CF,
            secondFactor: SC,
          };
        });

        perilakuCF = JSON.parse(perilakuCF);
        let kolomPerilakuCF = perilakuCF.map((item) => item.cf);

        let CFSFPerilaku = bobotPerilaku.map((item) => {
          let Id_Karyawan = item.Id_Karyawan;
          let CF = calculateCoreFactor(item, kolomPerilakuCF);
          let SC = calculateSecondFactor(item, kolomPerilakuCF);
          return {
            Id_Karyawan,
            coreFactor: CF,
            secondFactor: SC,
          };
        });

        let nilaiTotalKapasitasIntelektual = CFSFKapasitasIntelektual.map((item) => {
          return {
            Id_Karyawan: item.Id_Karyawan,
            nilaiTotal: (Number(prosentaseCF) * item.coreFactor) / 100 + (Number(prosentaseSF) * item.secondFactor) / 100,
          };
        });

        let nilaiTotalSikapKerja = CFSFSikapKerja.map((item) => {
          return {
            Id_Karyawan: item.Id_Karyawan,
            nilaiTotal: (Number(prosentaseCF) * item.coreFactor) / 100 + (Number(prosentaseSF) * item.secondFactor) / 100,
          };
        });

        let nilaiTotalPerilaku = CFSFPerilaku.map((item) => {
          return {
            Id_Karyawan: item.Id_Karyawan,
            nilaiTotal: (Number(prosentaseCF) * item.coreFactor) / 100 + (Number(prosentaseSF) * item.secondFactor) / 100,
          };
        });

        let hasilAkhirKapasitasIntelektual = nilaiTotalKapasitasIntelektual.map((item) => {
          return {
            Id_Karyawan: item.Id_Karyawan,
            hasilAkhir: (prosentaseKapasitasIntelektual * item.nilaiTotal) / 100,
          };
        });

        let hasilAkhirSikapKerja = nilaiTotalSikapKerja.map((item) => {
          return {
            Id_Karyawan: item.Id_Karyawan,
            hasilAkhir: (prosentaseSikapKerja * item.nilaiTotal) / 100,
          };
        });

        let hasilAkhirPerilaku = nilaiTotalPerilaku.map((item) => {
          return {
            Id_Karyawan: item.Id_Karyawan,
            hasilAkhir: (prosentasePerilaku * item.nilaiTotal) / 100,
          };
        });

        const hasilAkhir = hasilAkhirKapasitasIntelektual.map((kapasitasIntelektual) => {
          const sikap = hasilAkhirSikapKerja.find((item) => item.Id_Karyawan === kapasitasIntelektual.Id_Karyawan);
          const perilaku = hasilAkhirPerilaku.find((item) => item.Id_Karyawan === kapasitasIntelektual.Id_Karyawan);

          const totalHasilAkhir = kapasitasIntelektual.hasilAkhir + sikap.hasilAkhir + perilaku.hasilAkhir;

          return {
            Id_Karyawan: kapasitasIntelektual.Id_Karyawan,
            totalHasilAkhir: totalHasilAkhir.toFixed(2),
          };
        });

        const ranking = hasilAkhir.sort((a, b) => b.totalHasilAkhir - a.totalHasilAkhir);

        res.status(200).json({
          status: true,
          message: 'File processed successfully',
          data: ranking,
        });

        fs.unlinkSync(filePath);
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
