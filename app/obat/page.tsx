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
} from "@mui/material";
import DataTable from "@components/Table/DataTable";
import {
  getAllObat,
  getObatLen,
  getObatByName,
  editObat,
} from "@services/obat";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { snakeCaseToTitleCase } from "@utils/converters";

export default function Obat() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const [dataLen, setDataLen] = useState(0);
  const [data, setData] = useState<Obat[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setOpen] = useState(false);
  const [isToastOpen, setOpenToast] = useState(false);
  const [toastDetail, setToastDetail] = useState({
    type: "success",
    message: "Berhasil mengedit obat",
  });
  const [selected, setSelected] = useState<Obat | null>();

  const handleCloseModal = () => {
    setSelected(null);
    setOpen(false);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  const fetchObatData = async () => {
    setLoading(true);
    const { page, pageSize } = paginationModel;
    const start = page * pageSize;
    const fetchedData = await getAllObat(pageSize, start);
    const lenData = await getObatLen();
    setDataLen(lenData);
    setData(fetchedData);
    setLoading(false);
  };

  const fetchObatBasedQuery = async () => {
    if (query != "") {
      setLoading(true);
      const fetchedData = await getObatByName(query);
      setData(fetchedData);
      setDataLen(fetchedData.length);
      setPaginationModel({
        page: 0,
        pageSize: 20,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query === "") {
      fetchObatData();
    }
  }, [paginationModel, query]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query != "") {
        fetchObatBasedQuery();
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const columns: GridColDef[] = [
    { field: "nama_obat", headerName: "Nama Obat", minWidth: 350, flex: 1 },
    {
      field: "jenis",
      headerName: "Jenis",
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        snakeCaseToTitleCase(params.row.jenis),
    },
    {
      field: "subjenis",
      headerName: "Subjenis",
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        snakeCaseToTitleCase(params.row.subjenis),
    },
    { field: "stok", headerName: "Stok Obat", minWidth: 100, flex: 1 },
    {
      field: "aksi",
      headerName: "Aksi",
      sortable: false,
      renderCell: (params) => {
        const handleEditRow = () => {
          setSelected(params.row);
          setOpen(true);
        };

        return (
          <Button variant="contained" onClick={handleEditRow}>
            Edit
          </Button>
        );
      },
      minWidth: 150,
      flex: 1,
    },
  ];

  const handleSubmitEdit = async () => {
    if (!selected) {
      setToastDetail({ type: "error", message: "Mohon lengkapi form" });
      setOpenToast(true);
      return;
    }
    const idObat = selected.id;
    const editedObat = {
      nama_obat: selected.nama_obat,
      stok: selected.stok,
    };
    const res = await editObat(idObat, editedObat);
    if (res == "success") {
      setToastDetail({ type: "success", message: "Berhasil mengedit obat" });
      setOpenToast(true);

      if (query === "") {
        await fetchObatData();
      } else {
        await fetchObatBasedQuery();
      }
      setOpen(false);
    } else {
      setToastDetail({ type: "error", message: "Gagal mengedit obat" });
      setOpenToast(true);
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

      <Modal open={isModalOpen} onClose={handleCloseModal}>
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
            Edit Data Obat
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
              label="Nama Obat"
              value={selected?.nama_obat}
              onChange={(e) => {
                if (selected != null && selected != undefined) {
                  const newSelected = {
                    ...selected,
                    nama_obat: e.target.value,
                  };
                  setSelected(newSelected);
                }
              }}
              sx={{ width: "100%" }}
            />
            <TextField
              label="Stok"
              value={selected?.stok}
              onChange={(e) => {
                if (selected != null && selected !== undefined) {
                  const parsedValue = parseInt(e.target.value);
                  const newSelected = {
                    ...selected,
                    stok: isNaN(parsedValue) ? 0 : parsedValue,
                  };
                  setSelected(newSelected);
                }
              }}
              sx={{ width: "100%" }}
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
        Data Stok Obat
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: "1rem",
        }}
      >
        <OutlinedInput
          type="text"
          placeholder="Cari obat..."
          endAdornment={
            <InputAdornment position="end">
              <IconButton edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            minWidth: "40%",
          }}
        />
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
