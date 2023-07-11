import ExcelJS from "exceljs";

const ExcelGenerator = () => {
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "KODE", key: "kode" },
      { header: "NAMA OBAT", key: "namaObat" },
      { header: "SATUAN", key: "satuan" },
    ];

    const data = [
      { kode: 1, namaObat: "I. OBAT" },
      { namaObat: "OBAT CAIR" },
      { namaObat: "Air untuk irigasi lar infus 1000 ml", satuan: "botol" },
      { namaObat: "Ambroxol sirup", satuan: "botol" },
      { namaObat: "Aminofilin injeksi 24 mg/ml-10 ml", satuan: "botol" },
    ];

    data.forEach((row, index) => {
      const worksheetRow = worksheet.addRow(row);

      if (index === 0) {
        worksheetRow.eachCell((cell) => {
          cell.font = { bold: true, size: 12 };
        });
      }

      if (index === 1) {
        worksheetRow.eachCell((cell) => {
          cell.font = { bold: true, size: 12 };
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "example.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <button onClick={generateExcel}>Generate Excel</button>;
};

export default ExcelGenerator;
