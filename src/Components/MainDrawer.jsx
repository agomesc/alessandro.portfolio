import React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MainDrawer = ({ open, handleClose, title = "", children }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      aria-labelledby="drawer-title"
    >
      <Box
        sx={{
          width: { xs: "100vw", sm: 400 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography id="drawer-title" variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <IconButton onClick={handleClose} aria-label="Fechar">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};

export default React.memo(MainDrawer);
