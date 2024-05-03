import React from "react";
import { Button, Box } from "@mui/material";

const LoginPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "black",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        textAlign: "center"
      }}
    >
      <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/auth/login")}
            disableRipple
            startIcon={<img src="login-button.png" alt="Winners" style={{ width: '100%', maxWidth: '400px', height: 'auto' }} />}
            style={{ backgroundColor: 'transparent',boxShadow:'none', width: '100%', maxWidth: '200px', height: 'auto', marginTop: '500px'}}
          />
    </Box>
  );
};

export default LoginPage;
