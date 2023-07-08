"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { login } from "@services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isToastOpen, setOpenToast] = useState(false);
  const [toastDetail, setToastDetail] = useState({
    type: "success",
    message: "Berhasil mengedit obat",
  });
  const router = useRouter();

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await login(email, password);
    if (res == "success") {
      setOpenToast(true);
      setToastDetail({
        type: "success",
        message: "Berhasil masuk",
      });
      router.push("/obat");
    } else {
      setOpenToast(true);
      setToastDetail({ type: "error", message: "Email atau password salah" });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography component="h1" variant="h5">
          Masuk
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            marginTop: 1,
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginY: 3 }}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}
