// MyDrawer.js
import React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const MainDrawer = ({ open, handleClose, children }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-drawer-title"
    >
      <div style={{ width: "100vw", padding: "20px" }}>
        <IconButton
          style={{ position: "absolute", top: 0, right: 0 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </div>
    </Drawer>
  );
};

export default MainDrawer;
