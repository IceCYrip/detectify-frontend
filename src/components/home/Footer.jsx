import { styled, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const CustomContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-evenly",
    gap: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      textAlign: "center",
    },
  }));

  const FooterLink = styled("span")(({ theme }) => ({
    fontSize: "16px",
    color: "#7A7A7E",
    fontWeight: "300",
    cursor: "pointer",
    "&:hover": {
      color: "#000",
    },
    textDecoration: "none",
  }));

  return (
    <Box sx={{ py: 6 }}>
      <CustomContainer>
        <CustomContainer>
          <Box>
            <Typography
              sx={{
                fontSize: "20px",
                color: "#1C1C1D",
                fontWeight: "700",
                mb: 2,
              }}
            >
              Products
            </Typography>

            <FooterLink onClick={() => navigate("/scanner")}>
              Verify Product
            </FooterLink>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "20px",
                color: "#1C1C1D",
                fontWeight: "700",
                mb: 2,
              }}
            >
              Company
            </Typography>

            <FooterLink onClick={() => navigate("/about-us")}>
              About Us
            </FooterLink>
            <br />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "20px",
                color: "#1C1C1D",
                fontWeight: "700",
                mb: 2,
              }}
            >
              Get in touch
            </Typography>

            <FooterLink>
              <span style={{ fontWeight: 500 }}>Email - </span>
              supportdetectify@gmail.com
            </FooterLink>
            <br />
            <FooterLink>
              <span style={{ fontWeight: 500 }}>Contact - </span>
              +91-8788354162
            </FooterLink>
          </Box>
        </CustomContainer>
      </CustomContainer>
    </Box>
  );
};

export default Footer;
