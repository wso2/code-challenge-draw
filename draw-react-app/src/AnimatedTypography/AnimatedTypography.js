import React, { useState, useEffect } from "react";
import "./CyberTruckWinner.css";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

  export const AnimatedMacbookWinner = ({ actualWinner }) => {
    const elements = (
    <Typography variant="h3" color="#30fcfc" className="a-text" key={actualWinner} style={{ padding: 10, display:'flex', whiteSpace:'nowrap', justifyContent:'flex-start', fontFamily: 'Kanit, sans-serif', fontWeight: 400 }}>
      {actualWinner}
    </Typography>);
    const bar = <>
    <Box position="absolute" className='animated-bar' height={20}></Box>
    </>
    return (
      <Box height={75} overflow="hidden" position="relative" display="flex" justifyContent="flex-start" alignItems="center">
        {bar}
        <Box height="fit-content" className="animated-text2">{elements}</Box>
     </Box>
    );
  } 

  export const CountryTypography = ({ actualWinner }) => {
    const elements = (
    <Typography variant="h3" color="#30fcfc" className="a-text" key={actualWinner} style={{ padding: 10, display:'flex', whiteSpace:'nowrap', justifyContent:'flex-start', fontFamily: 'Kanit, sans-serif', fontWeight: 400 }}>
      ({actualWinner})
    </Typography>);

    return (
      <Box height={75} overflow="hidden" position="relative" display="flex" justifyContent="flex-start" alignItems="center">
        <Box height="fit-content" className="animated-text2">{elements}</Box>
     </Box>
    );
  } 