import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import InfoIcon from "@mui/icons-material/Info";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const [galleryData, setGalleryData] = useState([]);
  const instance = CreateFlickrApp();

  useEffect(() => {
    async function fetchData() {
      const data = await instance.getGallery();
      setGalleryData(data);
    }

    if (galleryData.length === 0) fetchData();
  }, [galleryData, instance]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const items = [
    {
      route: "/Gallery",
      description: "Minhas Galerias",
      icon: <PhotoLibraryIcon />,
    },
  ];

  // eslint-disable-next-line array-callback-return
  galleryData.map((item) => {
    items.push({
      route: `/Photos/${item.id}?`,
      description: item.title,
      icon: <ArtTrackIcon />,
    });
  });

  items.push({ route: "/LatestPhotos", description: "Atualizações", icon: <DynamicFeedIcon /> });
  items.push({ route: "/About", description: "Sobre", icon: <InfoIcon /> });

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton component="a" href={item.route}>
              <ListItemIcon
                size="small"
                edge="start"
                color="inherit"
                aria-label="menu"
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.description} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <AppBar position="fixed" color="primary" sx={{ top: 0 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Alessandro - Portfólio
          </Typography>
          {
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          }
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
