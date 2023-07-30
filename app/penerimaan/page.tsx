"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  Button,
  Modal,
  TextField,
  Snackbar,
  Alert,
  AlertColor,
  Select,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DataTable from "@components/Table/DataTable";
import { editObat, getObatNoFilter } from "@services/obat";
import { getAllPuskesmas } from "@services/puskesmas";
import {
  getAllPenerimaan,
  getPenerimaanByMonth,
  editPenerimaan,
  addPenerimaan,
  getPenerimaanLen,
  deletePenerimaan,
} from "@services/penerimaan";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  formatIndonesianDateToISO,
  formatIndonesianDate,
} from "@utils/converters";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Penerimaan() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const [dataLen, setDataLen] = useState(0);
  const [data, setData] = useState<Penerimaan[]>([]);
  const [autoCompleteObat, setAutoCompleteObat] = useState<Obat[]>([]);
  const [autoCompletePuskesmas, setAutoCompletePuskesmas] = useState<
    Puskesmas[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isToastOpen, setOpenToast] = useState(false);
  const [toastDetail, setToastDetail] = useState({
    type: "success",
    message: "Berhasil mengedit obat",
  });
  const [selected, setSelected] = useState<Penerimaan | null>();
  const [deleted, setDeleted] = useState<Penerimaan | null>();
  const [sumberAdd, setSumberAdd] = useState("");
  const [newPenerimaan, setNewPenerimaan] = useState<Partial<Penerimaan>>({
    jumlah: 0,
    nama_obat: "",
    obat_id: "",
    sumber: "",
  });
  const [newPenerimaanList, setNewPenerimaanList] = useState<
    Partial<Penerimaan>[]
  >([]);
  const [editPenerimaanDate, setEditPenerimaanDate] = useState<Dayjs | null>(
    dayjs()
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>();

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setSelected(null);
    setEditModalOpen(false);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  const handleCloseDialog = () => {
    setDeleted(null);
    setDialogOpen(false);
  };

  const fetchPenerimaanData = async () => {
    setLoading(true);
    const { page, pageSize } = paginationModel;
    const start = page * pageSize;
    const fetchedData = await getAllPenerimaan(pageSize, start);
    const lenData = await getPenerimaanLen();
    setDataLen(lenData);
    setData(fetchedData);
    setLoading(false);
  };

  const fetchPenerimaanByMonth = async () => {
    if (!selectedDate) return;
    const theDate = selectedDate.toDate();

    if (!(theDate instanceof Date && !isNaN(theDate.getTime()))) return;
    setLoading(true);
    const month = selectedDate.toDate().getMonth();
    const year = selectedDate.toDate().getFullYear();
    const fetchedData = await getPenerimaanByMonth(month, year);
    setDataLen(fetchedData.length);
    setData(fetchedData);
    setPaginationModel({
      page: 0,
      pageSize: 20,
    });
    setLoading(false);
  };

  const fetchAllObat = async () => {
    const fetchedData = await getObatNoFilter();
    setAutoCompleteObat(fetchedData);
  };

  const fetchAllPuskesmas = async () => {
    const fetchedData = await getAllPuskesmas();
    setAutoCompletePuskesmas(fetchedData);
  };

  useEffect(() => {
    if (
      !selectedDate ||
      !(selectedDate.toDate() instanceof Date) ||
      isNaN(selectedDate.toDate().getTime())
    ) {
      fetchPenerimaanData();
    }
  }, [paginationModel, selectedDate]);

  useEffect(() => {
    fetchPenerimaanByMonth();
  }, [selectedDate]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPenerimaanByMonth();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [selectedDate]);

  useEffect(() => {
    if (autoCompleteObat.length <= 0) {
      fetchAllObat();
    }
    if (autoCompletePuskesmas.length <= 0) {
      fetchAllPuskesmas();
    }
  }, []);

  const columns: GridColDef[] = [
    {
      field: "tanggal_penerimaan",
      headerName: "Tanggal",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "sumber",
      headerName: "Sumber",
      minWidth: 100,
      flex: 1,
    },
    { field: "nama_obat", headerName: "Nama Obat", minWidth: 100, flex: 1 },
    { field: "jumlah", headerName: "Jumlah", minWidth: 100, flex: 1 },
    {
      field: "aksi",
      headerName: "Aksi",
      sortable: false,
      renderCell: (params) => {
        const handleEditRow = () => {
          setSelected(params.row);
          setEditPenerimaanDate(
            dayjs(formatIndonesianDateToISO(params.row.tanggal_penerimaan))
          );
          setEditModalOpen(true);
        };

        const handleDeleteRow = () => {
          setDeleted(params.row);
          setDialogOpen(true);
        };

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Button variant="contained" onClick={handleEditRow}>
              Edit
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteRow}
              sx={{ backgroundColor: "red" }}
            >
              Hapus
            </Button>
          </Box>
        );
      },
      minWidth: 200,
      flex: 1,
    },
  ];

  const handleSubmitAdd = async () => {
    let allSuccess = true;

    for (const newItem of newPenerimaanList) {
      if (
        newItem.nama_obat === "" ||
        !newItem.jumlah ||
        sumberAdd === "" ||
        !newItem.tanggal_penerimaan
      ) {
        setToastDetail({ type: "error", message: "Mohon lengkapi form" });
        setOpenToast(true);
        allSuccess = false;
        break;
      }

      const selectedObat = autoCompleteObat.find(
        (obat) => obat.nama_obat === newItem.nama_obat
      );

      if (!selectedObat) {
        setToastDetail({ type: "error", message: "Obat tidak valid" });
        setOpenToast(true);
        allSuccess = false;
        break;
      }

      const selectedPuskesmas = autoCompletePuskesmas.find(
        (puskesmas) => puskesmas.nama_puskesmas === sumberAdd
      );

      if (!selectedPuskesmas) {
        setToastDetail({ type: "error", message: "Obat tidak valid" });
        setOpenToast(true);
        allSuccess = false;
        break;
      }

      const payload = {
        ...newItem,
        tanggal_penerimaan: new Date(newItem.tanggal_penerimaan.toString()),
        obat_id: selectedObat.id,
        sumber_kode: selectedPuskesmas.kode,
        sumber: selectedPuskesmas.nama_puskesmas,
      } as Partial<Penerimaan>;

      const res = await addPenerimaan(payload);
      if (res !== "success") {
        setToastDetail({
          type: "error",
          message: "Gagal menambahkan penerimaan",
        });
        setOpenToast(true);
        allSuccess = false;
        break;
      }
    }

    if (allSuccess) {
      setToastDetail({
        type: "success",
        message: "Berhasil menambahkan penerimaan",
      });
      setOpenToast(true);
      await fetchPenerimaanData();
      setNewPenerimaanList([]);
      handleCloseAddModal();
    }
  };

  const handleSubmitEdit = async () => {
    if (!selected) {
      setToastDetail({ type: "error", message: "Mohon lengkapi form" });
      setOpenToast(true);
      return;
    }
    const idSelected = selected.id;

    if (!editPenerimaanDate) {
      setToastDetail({ type: "error", message: "Mohon lengkapi form" });
      setOpenToast(true);
      return;
    }

    const selectedObat = autoCompleteObat.find(
      (obat) => obat.nama_obat === selected.nama_obat
    );

    if (!selectedObat) {
      setToastDetail({ type: "error", message: "Obat tidak valid" });
      setOpenToast(true);
      return;
    }

    const selectedPuskesmas = autoCompletePuskesmas.find(
      (puskesmas) => puskesmas.nama_puskesmas === selected.sumber
    );

    if (!selectedPuskesmas) {
      setToastDetail({ type: "error", message: "Obat tidak valid" });
      setOpenToast(true);
      return;
    }

    const editedPenerimaan = {
      nama_obat: selectedObat.nama_obat,
      sumber: selectedPuskesmas.nama_puskesmas,
      jumlah: selected.jumlah,
      tanggal_penerimaan: editPenerimaanDate.toDate(),
      obat_id: selectedObat.id,
      sumber_kode: selectedPuskesmas.kode,
    } as Partial<Penerimaan>;

    const res = await editPenerimaan(idSelected, editedPenerimaan);
    if (res == "success") {
      setOpenToast(true);
      setToastDetail({ type: "success", message: "Berhasil mengedit obat" });
      await fetchPenerimaanData();
      setEditModalOpen(false);
    } else {
      setOpenToast(true);
      setToastDetail({ type: "error", message: "Gagal mengedit obat" });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleted) {
      setToastDetail({ type: "error", message: "Mohon lengkapi form" });
      setOpenToast(true);
      return;
    }
    const idPenerimaan = deleted.id;
    const res = await deletePenerimaan(idPenerimaan);
    if (res == "success") {
      setOpenToast(true);
      setToastDetail({
        type: "success",
        message: "Berhasil menghapus penerimaan",
      });
      await fetchPenerimaanData();
      handleCloseDialog();
    } else {
      setOpenToast(true);
      setToastDetail({ type: "error", message: "Gagal menghapus penerimaan" });
    }
  };

  return (
    <Grid container minHeight="100vh" direction="column">
      <Snackbar
        open={isToastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastDetail.type as AlertColor}
          sx={{ width: "100%" }}
        >
          {toastDetail.message}
        </Alert>
      </Snackbar>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{"Apakah yakin ingin menghapus penerimaan?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Anda akan menghapus penerimaan ini
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ paddingBottom: "1rem", paddingRight: "1rem" }}>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Tidak
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteSubmit}
            autoFocus
            sx={{ background: "red" }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ marginBottom: "2rem" }}>
            Tambah Data Penerimaan
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "1rem",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Sumber"
              value={sumberAdd}
              onChange={(e) => {
                setSumberAdd(e.target.value);
              }}
              sx={{ width: "100%" }}
            />

            <Button
              variant="contained"
              onClick={() => {
                setNewPenerimaanList((prevList) => [
                  ...prevList,
                  {
                    jumlah: 0,
                    nama_obat: "",
                    obat_id: "",
                    sumber: "",
                    batch: "",
                    faktur: "",
                    tanggal_kadaluarsa: null as any,
                    tanggal_penerimaan: null as any,
                    harga_obat: 0,
                  } as Partial<Penerimaan>,
                ]);
              }}
            >
              Tambah Obat
            </Button>

            <Box>
              {newPenerimaanList.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    label="Nomor Batch"
                    value={item.batch}
                    onChange={(e) => {
                      const updatedList = [...newPenerimaanList];
                      updatedList[index].batch = e.target.value;
                      setNewPenerimaanList(updatedList);
                    }}
                    sx={{ width: "15%" }}
                  />

                  <TextField
                    label="Nomor Faktur"
                    value={item.faktur}
                    onChange={(e) => {
                      const updatedList = [...newPenerimaanList];
                      updatedList[index].faktur = e.target.value;
                      setNewPenerimaanList(updatedList);
                    }}
                    sx={{ width: "15%" }}
                  />

                  <Autocomplete
                    value={item.nama_obat}
                    onChange={(event: any, newValue: string | null) => {
                      const updatedList = [...newPenerimaanList];
                      updatedList[index].nama_obat = newValue ?? "";
                      setNewPenerimaanList(updatedList);
                    }}
                    disablePortal
                    options={autoCompleteObat.map((option) => option.nama_obat)}
                    sx={{ width: "25%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Nama Obat" />
                    )}
                  />

                  <TextField
                    label="Jumlah"
                    value={item.jumlah}
                    onChange={(e) => {
                      const parsedValue = parseInt(e.target.value);
                      const updatedList = [...newPenerimaanList];
                      updatedList[index].jumlah = isNaN(parsedValue)
                        ? 0
                        : parsedValue;
                      setNewPenerimaanList(updatedList);
                    }}
                    sx={{ width: "10%" }}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker"]}
                      sx={{ width: "20%" }}
                    >
                      <DatePicker
                        label="Tanggal Diterima"
                        value={item.tanggal_penerimaan}
                        onChange={(newValue) => {
                          const updatedList = [...newPenerimaanList];
                          updatedList[index].tanggal_penerimaan =
                            newValue as any;
                          setNewPenerimaanList(updatedList);
                        }}
                        sx={{ marginBottom: 1 }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker"]}
                      sx={{ width: "20%" }}
                    >
                      <DatePicker
                        label="Tanggal ED"
                        value={item.tanggal_kadaluarsa}
                        onChange={(newValue) => {
                          const updatedList = [...newPenerimaanList];
                          updatedList[index].tanggal_kadaluarsa =
                            newValue as any;
                          setNewPenerimaanList(updatedList);
                        }}
                        sx={{ marginBottom: 1 }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  <TextField
                    label="Harga"
                    value={item.harga_obat}
                    onChange={(e) => {
                      const parsedValue = parseInt(e.target.value);
                      const updatedList = [...newPenerimaanList];
                      updatedList[index].harga_obat = isNaN(parsedValue)
                        ? 0
                        : parsedValue;
                      setNewPenerimaanList(updatedList);
                    }}
                    sx={{ width: "15%" }}
                  />

                  {/* Remove button */}
                  <IconButton
                    onClick={() => {
                      const updatedList = [...newPenerimaanList];
                      updatedList.splice(index, 1);
                      setNewPenerimaanList(updatedList);
                    }}
                    sx={{ background: "red", color: "white", fontSize: "1em" }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" onClick={handleSubmitAdd}>
                Tambah
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ marginBottom: "2rem" }}>
            Edit Data Penerimaan
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "1rem",
            }}
            noValidate
            autoComplete="off"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Tanggal Penerimaan"
                  value={editPenerimaanDate}
                  onChange={(newValue) => setEditPenerimaanDate(newValue)}
                  sx={{ width: "100%" }}
                  format="DD MMMM YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>

            {/* <Select
              value={selected?.tipe}
              onChange={(e) => {
                if (selected != null && selected != undefined) {
                  const newSelected = {
                    ...selected,
                    tipe: e.target.value,
                  };
                  setSelected(newSelected);
                }
              }}
            >
              <MenuItem value={"tambah"}>Penambahan</MenuItem>
              <MenuItem value={"kurang"}>Pengurangan</MenuItem>
            </Select> */}

            <Autocomplete
              value={selected?.nama_obat}
              onChange={(event: any, newValue: string | null) => {
                if (selected != null && selected != undefined) {
                  const newSelected = {
                    ...selected,
                    nama_obat: newValue ?? "",
                  };
                  setSelected(newSelected);
                }
              }}
              disablePortal
              options={autoCompleteObat.map((option) => option.nama_obat)}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Nama Obat" />
              )}
            />

            <TextField
              label="Jumlah"
              value={selected?.jumlah}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value);
                if (selected != null && selected != undefined) {
                  const newSelected = {
                    ...selected,
                    jumlah: isNaN(parsedValue) ? 0 : parsedValue,
                  };
                  setSelected(newSelected);
                }
              }}
              sx={{ width: "100%" }}
            />

            <Autocomplete
              value={selected?.sumber}
              onChange={(event: any, newValue: string | null) => {
                if (selected != null && selected != undefined) {
                  const newSelected = {
                    ...selected,
                    sumber: newValue ?? "",
                  };
                  setSelected(newSelected);
                }
              }}
              disablePortal
              options={autoCompletePuskesmas.map(
                (option) => option.nama_puskesmas
              )}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} label="Sumber" />}
            />

            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" onClick={handleSubmitEdit}>
                Edit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "2em",
        }}
      >
        Data Penerimaan Obat
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
        <Button
          variant="contained"
          onClick={handleAddModalOpen}
          sx={{ maxWidth: "30%" }}
        >
          Tambah Penerimaan
        </Button>
      </Box>
      <DataTable
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        data={data}
        dataLen={dataLen}
        loading={loading}
        columns={columns}
      />
    </Grid>
  );
}
