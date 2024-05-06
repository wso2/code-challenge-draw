import React from "react";
import "./CyberTruckWinner.css";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export const AnimatedMacbookWinner = ({ actualWinner }) => {
  const elements = (
    <Typography
      variant="h3"
      color="#30fcfc"
      key={actualWinner}
      style={{
        padding: 10,
        display: "flex",
        whiteSpace: "nowrap",
        justifyContent: "flex-start",
        fontFamily: "Kanit, sans-serif",
        fontWeight: 400,
      }}
    >
      {actualWinner}
    </Typography>
  );
  const bar = (
    <>
      <div class="loader-mb-winner bars" style={{ height: 20 }}></div>
    </>
  );
  return (
    <Box
      height={75}
      overflow="visible"
      position="relative"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
    >
      {bar}
      <Box height="fit-content" className="animated-mb-winner-text">
        {elements}
      </Box>
    </Box>
  );
};

export const AnimatedTruckWinner = ({ actualWinner }) => {
  const elements = (
    <Typography
      variant="h2"
      color="#30fcfc"
      key={actualWinner}
      style={{
        padding: 10,
        display: "flex",
        whiteSpace: "nowrap",
        justifyContent: "flex-start",
        fontFamily: "Kanit, sans-serif",
        fontWeight: 400,
      }}
    >
      {actualWinner}
    </Typography>
  );
  const bar = (
    <>
      <div class="loader-truck-winner bars" style={{ height: 20 }}></div>
    </>
  );
  return (
    <Box
      height={75}
      overflow="visible"
      position="relative"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
    >
      {bar}
      <Box height="fit-content" className="animated-truck-winner-text">
        {elements}
      </Box>
    </Box>
  );
};

export const CountryTypography = ({ countryName }) => {
  const elements = (
    <Typography
      variant="h4"
      color="#30fcfc"
      style={{
        padding: 10,
        display: "flex",
        whiteSpace: "nowrap",
        justifyContent: "flex-start",
        fontFamily: "Kanit, sans-serif",
        fontWeight: 400,
      }}
    >
      ({countryName})
    </Typography>
  );

  return (
    <Box
      height={75}
      overflow="hidden"
      position="relative"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Box height="fit-content" className="animated-truck-winner-text">
        {elements}
      </Box>
    </Box>
  );
};
