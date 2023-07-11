"use client";
import { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs, { Dayjs } from "dayjs";
import { getAllPuskesmas } from "@services/puskesmas";
import { getObatNoFilter } from "@services/obat";
import { getPermintaanByMonth } from "@services/permintaan";
import ExcelJS from "exceljs";

export default function Permintaan() {
  const [puskesmas, setPuskesmas] = useState<Puskesmas[]>([]);
  const [obat, setObat] = useState<Obat[]>([]);
  const [permintaan, setPermintaan] = useState<Permintaan[]>([]);
  const [mutasiObat, setMutasiObat] = useState<Obat[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const validDate = () => {
    return (
      selectedDate &&
      selectedDate.toDate() instanceof Date &&
      !isNaN(selectedDate.toDate().getTime())
    );
  };

  const fetchAllPuskesmas = async () => {
    const res = await getAllPuskesmas();
    setPuskesmas(res);
  };

  const fetchAllObat = async () => {
    const res = await getObatNoFilter();
    setObat(res);
  };

  const fetchPermintaanByMonth = async () => {
    if (!selectedDate) return;
    const theDate = selectedDate.toDate();

    if (!(theDate instanceof Date && !isNaN(theDate.getTime()))) return;
    const month = selectedDate.toDate().getMonth();
    const year = selectedDate.toDate().getFullYear();
    const res = await getPermintaanByMonth(month, year);
    setPermintaan(res);
  };

  const checkObatPermintaan = async () => {
    const updatedObat = await Promise.all(
      obat.map(async (o) => {
        const obatPermintaan = permintaan.filter(
          (p) => p.obat_id === o.id && p.tipe === "kurang"
        );

        const checkedPuskesmas: PuskesmasObat[] = await Promise.all(
          puskesmas.map(async (p) => {
            const jumlah = obatPermintaan.reduce((total, permintaanItem) => {
              if (permintaanItem.sumber_kode === p.kode) {
                return total + permintaanItem.jumlah;
              }
              return total;
            }, 0);

            return {
              puskesmas: p,
              jumlah: jumlah || 0,
            };
          })
        );

        return {
          ...o,
          permintaan: checkedPuskesmas,
        };
      })
    );

    setMutasiObat(updatedObat);
  };

  const fetchData = async () => {
    await fetchAllPuskesmas();
    await fetchAllObat();
    await fetchPermintaanByMonth();
  };

  const calculateTotalJumlah = (permintaanObat: PuskesmasObat[]) => {
    let totalJumlah = 0;

    permintaanObat.forEach((pj) => {
      totalJumlah += pj.jumlah;
    });

    return totalJumlah;
  };

  const handleDownloadExcel = async () => {
    if (loading) return;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Add headers to the worksheet
    const headerRow = worksheet.addRow([
      "NAMA OBAT",
      "SATUAN",
      ...puskesmas.map((p) => p.kode),
      "JUMLAH",
    ]);

    // Apply styles to the header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F2F2F2" },
      };
      cell.font = { bold: true };
    });

    // Add data rows to the worksheet
    mutasiObat.forEach((o) => {
      const dataRow = worksheet.addRow([
        o.nama_obat,
        o.satuan,
        ...o.permintaan.map((pj) => pj.jumlah),
        calculateTotalJumlah(o.permintaan),
      ]);
    });

    // Auto-fit column widths
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rekap Pemberian ${selectedDate?.format("MMMM YYYY")}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (validDate()) {
        fetchData();
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [selectedDate]);

  useEffect(() => {
    if (obat.length != 0 && puskesmas.length != 0 && permintaan.length != 0) {
      setLoading(true);
      checkObatPermintaan();
      setLoading(false);
    }
  }, [obat, puskesmas, permintaan]);

  return (
    <Grid container minHeight="100vh" direction="column">
      <Typography variant="h5" component="h2" sx={{ marginBottom: "2rem" }}>
        MUTASI PENGELUARAN IFK
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "1rem",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateField", "DateField"]}>
            <DateField
              label="Pilih Bulan"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              format="MM-YYYY"
              sx={{ maxWidth: "30%" }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleDownloadExcel}
          sx={{ maxWidth: "30%" }}
          disabled={loading}
        >
          Download Excel
        </LoadingButton>
      </Box>
      <div
        style={{
          height: "80vh",
          width: "100%",
          overflow: "auto",
          paddingBottom: "5rem",
        }}
      >
        {validDate() ? (
          !loading ? (
            <table
              style={{
                width: "90vw",
                height: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#F2F2F2", fontWeight: "bold" }}>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #CCCCCC",
                      minWidth: 200,
                    }}
                  >
                    NAMA OBAT
                  </th>
                  <th style={{ padding: "8px", border: "1px solid #CCCCCC" }}>
                    SATUAN
                  </th>
                  {puskesmas.map((p) => (
                    <th
                      key={p.id}
                      style={{ padding: "8px", border: "1px solid #CCCCCC" }}
                    >
                      {p.kode}
                    </th>
                  ))}
                  <th style={{ padding: "8px", border: "1px solid #CCCCCC" }}>
                    JUMLAH
                  </th>
                </tr>
              </thead>
              <tbody>
                {mutasiObat.map((o) => (
                  <tr style={{ backgroundColor: "#FFFFFF" }} key={o.id}>
                    <td style={{ padding: "8px", border: "1px solid #CCCCCC" }}>
                      {o.nama_obat}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #CCCCCC" }}>
                      {o.satuan}
                    </td>
                    {o.permintaan.map((pj) => (
                      <td
                        key={pj.puskesmas.id}
                        style={{ padding: "8px", border: "1px solid #CCCCCC" }}
                      >
                        {pj.jumlah}
                      </td>
                    ))}
                    <td style={{ padding: "8px", border: "1px solid #CCCCCC" }}>
                      {calculateTotalJumlah(o.permintaan)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "80vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{ marginBottom: "2rem" }}
              >
                Loading...
              </Typography>
            </Box>
          )
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "80vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginBottom: "2rem" }}
            >
              Pilih Tanggal
            </Typography>
          </Box>
        )}
      </div>
    </Grid>
  );
}
