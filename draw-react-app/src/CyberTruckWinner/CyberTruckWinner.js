import React, { useState, useEffect } from "react";
import "./CyberTruckWinner.css";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { getCyberTruckWinner } from "../api/api";
import { AnimatedMacbookWinner, CountryTypography } from "../AnimatedTypography/AnimatedTypography";

const CyberTruckWinner = () => {
  const [displayWinner, setDisplayWinner] = useState(false);
  const [winner, setWinner] = useState({
    name: 'Alex Smith',
    country: 'United States'
  });

  useEffect(() => {}, []);

  const showCyberTruckWinnerClicked = async () => {
    const winnerData = await getCyberTruckWinner();
    setWinner(winnerData);
    setDisplayWinner(true);
  }

  return (
    <Box textAlign="center" className="cyberTruckWinnerBackground">
      <Box sx={{display: 'flex', justifyContent: 'center', pt: 50, pl: 5}}>
        {displayWinner ? (
          <div style={{marginTop: 40, flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <AnimatedMacbookWinner actualWinner={winner.name}/>
            <CountryTypography actualWinner={winner.country}/>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              showCyberTruckWinnerClicked();
            }}
            disableRipple
            startIcon={<img src="select-winner.png" alt="Winners" style={{ width: '100%', maxWidth: '200px', height: 'auto' }} />}
            style={{ backgroundColor: 'transparent', width: '100%', maxWidth: '400px', height: 'auto',boxShadow:'none' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default CyberTruckWinner;
