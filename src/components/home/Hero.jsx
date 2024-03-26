import { Box, Button, styled, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import Navbar from "./Navbar";
import bgImg from "../../img/bg.png";
import heroImg from "../../img/hero_illustration.png";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";

const Hero = () => {
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(5),
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  }));

  const Title = styled(Typography)(({ theme }) => ({
    fontSize: "64px",
    color: "#000336",
    fontWeight: "bold",
    margin: theme.spacing(4, 0, 4, 0),
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
    },
  }));

  return (
    <Box
      sx={{
        backgroundColor: "#E6F0FF",
        height: "92vh",

        display: "grid",
        placeItems: "center",
      }}
    >
      <Container>
        {/* <Navbar /> */}
        <CustomBox>
          <Box sx={{ flex: "2" }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "25px",
                color: "#687690",
                fontWeight: "500",
                mt: 1,
                mb: 4,
              }}
            >
              Welcome to Detectify
            </Typography>
            <Title variant="h1">
              Securely Authenticate Your Products with Detectify
            </Title>
            <Typography
              variant="body2"
              sx={{ fontSize: "18px", color: "#5A6473", my: 4 }}
            >
              Our cutting-edge product identification system, powered by
              blockchain technology, ensures a secure and dependable process for
              verifying product authenticity and preventing fraud with
              confidence.
            </Typography>
            <div style={{ display: "flex", gap: 20 }}>
              <Link to="/scanner">
                <CustomButton
                  backgroundColor="#0F1B4C"
                  color="#fff"
                  buttonText="Scan QR"
                  heroBtn={true}
                />
              </Link>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <CustomButton
                  backgroundColor="#0F1B4C"
                  color="#fff"
                  buttonText="Login"
                  NavLink="/login"
                />
              </Link>
            </div>
          </Box>

          <Box sx={{ flex: "1.25", marginBottom: "10vh" }}>
            <img
              src={heroImg}
              alt="heroImg"
              style={{ maxWidth: "100%", marginBottom: "2rem" }}
            />
          </Box>
        </CustomBox>
      </Container>
    </Box>
  );
};

export default Hero;
