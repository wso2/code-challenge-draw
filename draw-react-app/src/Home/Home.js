import React, { useState, useEffect } from "react";
import "./Home.css";
import MacBookWinners from "../MacBookWinners/MacbookWinners";
import CyberTruckWinner from "../CyberTruckWinner/CyberTruckWinner";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

const Home = () => {
  const [page, setPage] = useState("macbookWinners");
  const [displayNext, setDisplayNext] = useState(false);
  useEffect(() => {}, []);

  return (
    <div className="homeBackground">
      {page === "macbookWinners" ? (
        <MacBookWinners setDisplayNext={setDisplayNext} />
      ) : (
        <CyberTruckWinner />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginRight: 10,
          marginTop: -20
        }}
      >
        {displayNext && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            disableRipple
            startIcon={
              <img
                src="next-arrow.png"
                alt="go"
                style={{ width: "100%", maxWidth: "150", height: "auto" }}
              />
            }
            style={{
              backgroundColor: "transparent",
              width: "100%",
              maxWidth: "150px",
              height: "auto",
              boxShadow: "none"
            }}
            onClick={() => {
              setPage("cyberTruckWinner");
              setDisplayNext(false);
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default Home;
