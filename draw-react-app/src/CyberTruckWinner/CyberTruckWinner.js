import React, { useState } from "react";
import "./CyberTruckWinner.css";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { getCyberTruckWinner } from "../api/api";
import { AnimatedTruckWinner, CountryTypography } from "../AnimatedTypography/AnimatedTypography";

const CyberTruckWinner = ({ macbookWinners }) => {
  const [displayWinner, setDisplayWinner] = useState(false);
  const [winner, setWinner] = useState({});

  const showCyberTruckWinnerClicked = async () => {
    const winnerData = await getCyberTruckWinner(macbookWinners);
    setWinner(winnerData);
    setDisplayWinner(true);
  }

  return (
    <Box textAlign="center" className="cyberTruckWinnerBackground">
      <Box sx={{display: 'flex', justifyContent: 'center', pt: 40, pl: 5}}>
        {displayWinner ? (
          <div style={{marginTop: 40, flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <AnimatedTruckWinner actualWinner={winner.name}/>
            <CountryTypography countryName={winner.country}/>
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
            startIcon={<img src="select-winner.png" alt="Winners" style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />}
            style={{ backgroundColor: 'transparent', width: '100%', maxWidth: '400px', height: 'auto',boxShadow:'none' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default CyberTruckWinner;
