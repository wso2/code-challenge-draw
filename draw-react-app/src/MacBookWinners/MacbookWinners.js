import React, { useState, useEffect } from "react";
import "./MacBookWinners.css";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { getMacbookWinners } from "../api/api";
import { AnimatedMacbookWinner } from "../AnimatedTypography/AnimatedTypography";

const MacBookWinners = ({ setDisplayNext }) => {
  const [displayWinners, setDisplayWinners] = useState(false);
  const [winners, setWinners] = useState([]);
  const [leftColumnWinners, setLeftColumnWinners] = useState([]);
  const [rightColumnWinners, setRightColumnWinners] = useState([]);

  const showMacWinnersClicked = async () => {
    const winnersData = await getMacbookWinners();
    setWinners(winnersData);
    setLeftColumnWinners(winnersData.slice(0, 5));
    setRightColumnWinners(winnersData.slice(5));
    setDisplayWinners(true);
  };

  const [counter, setCounter] = useState(0);
  useEffect(() => {
      setDisplayNext(counter > 10);
  },[counter]);

  useEffect(() => {
    setCounter(1)
    const interval = setInterval(() => {
      if (displayWinners) {
         setCounter((counter) => counter + 1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [displayWinners]);
  return (
    <Box textAlign="center" className="macbookWinnersBackground" display="flex" justifyContent="center" alignItems="center">
      <Box maxWidth={1200}>
        {displayWinners ? (
          <div style={{ display: "flex", gap:100, minWidth:1200, height:380, justifyContent:'center', alignItems:'flex-start'}}>
            {/* Left column */}
            <div style={{ display: "flex", flexDirection:'column', minWidth:500, justifyContent:'center'}}>
              {leftColumnWinners.map((winner, index) => {
                return (
                  counter > index && (
                    <Box display="flex" flexDirection="row" key={winner.name}>
                      <Typography
                        variant="h3"
                        color="#30fcfc"
                        className="a-text"
                        key={winner.name}
                        style={{
                          padding: 10,
                          display: "flex",
                          whiteSpace: "nowrap",
                          justifyContent: "flex-start",
                          fontFamily: "Kanit, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {index + 1}.
                      </Typography>
                      <AnimatedMacbookWinner actualWinner={winner.name}/>
                    </Box>
                  )
                );
              })}
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection:'column',minWidth:500, justifyContent:'center' }}>
              {rightColumnWinners.map(
                (winner, index) =>
                  counter > index + leftColumnWinners.length && (
                    <Box display="flex" flexDirection="row" key={winner.name}>
                    <Typography
                      variant="h3"
                      color="#30fcfc"
                      className="a-text"
                      key={winner.name}
                      style={{
                        padding: 10,
                        display: "flex",
                        whiteSpace: "nowrap",
                        justifyContent: "flex-start",
                        fontFamily: "Kanit, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {index + leftColumnWinners.length + 1}.
                    </Typography>
                    <AnimatedMacbookWinner actualWinner={winner.name}/>
                  </Box>
                  )
              )}
            </div>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              showMacWinnersClicked();
            }}
            disableRipple
            startIcon={
              <img
                src="select-winners.png"
                alt="Winners"
                style={{ width: "100%", maxWidth: "200px", height: "auto" }}
              />
            }
            style={{
              backgroundColor: "transparent",
              width: "100%",
              boxShadow:'none',
              borderRadius: '100%',
              maxWidth: "400px",
              height: "auto",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MacBookWinners;
