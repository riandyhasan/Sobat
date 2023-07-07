import React from "react";
import { styled } from "@mui/system";
import { Typography, Container } from "@mui/material";

const FooterContainer = styled("footer")(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
}));

const drawerWidth = 240;

const Footer = () => {
  return (
    <FooterContainer
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          &#169; Copyright Riandy Hasan 2023
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
