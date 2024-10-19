import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect, useState, Suspense } from "react";
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
import Collapse from "@mui/material/Collapse";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import InfoIcon from "@mui/icons-material/Info";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import { Link } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebaseConfig';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import PolicyIcon from '@mui/icons-material/Policy';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LoadingMessage from "../Components/LoadingMessage";

const TemporaryDrawer = () => {
	const [open, setOpen] = React.useState(false);
	const [openSub, setOpenSub] = React.useState(false);
	const [user, setUser] = useState(null);
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getGallery();
			setGalleryData(data);
		}

		if (!galleryData) fetchData();
	}, [galleryData, instance]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});
		return () => unsubscribe();
	}, []);

	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const handleClick = () => {
		setOpenSub(!openSub);
	};

	const items = [
		{
			route: "/Home",
			description: "Home",
			chid: false,
			icon: <HomeIcon />,
		},
		{
			// eslint-disable-next-line no-script-url
			route: "JavaScript:void(0);",
			description: "Minhas Galerias",
			chid: false,
			icon: <PhotoLibraryIcon />,
		},
	];

	const handleLogout = () => {
		signOut(auth).then(() => {
			// Sign-out successful.
			console.log('Usuário deslogado');
		}).catch((error) => {
			// An error happened.
			console.error('Erro ao deslogar', error);
		});
	};

	// eslint-disable-next-line array-callback-return
	galleryData.map((item) => {
		items.push({
			route: `/Photos/${item.id}?`,
			description: item.title,
			chid: true,
			icon: <ArtTrackIcon />,
		});
	});

	items.push({
		route: "/LatestPhotos",
		description: "Atualizações",
		chid: false,
		icon: <DynamicFeedIcon />,
	});

	items.push({ route: "/Privacidade", description: "Política de Privacidade", chid: false, icon: <PolicyIcon /> });
	items.push({ route: "/Transparencia", description: "Transparência", chid: false, icon: <AdminPanelSettingsIcon /> });
	items.push({ route: "/About", description: "Sobre", chid: false, icon: <InfoIcon /> });
	items.push({ route: "/Login", description: "Login", chid: false, icon: <AccountCircle /> });

	const DrawerList = (
		<Suspense fallback={<LoadingMessage />}>
			<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
				<Divider />
				<List>
					{items.map((item, index) => {
						const isChild = item.chid;
						const hasChildren = items[index + 1] && items[index + 1].chid;

						if (!isChild) {
							return (
								<ListItem key={index} disablePadding>
									<ListItemButton
										component="a"
										href={item.route}
										onClick={(event) => {
											event.stopPropagation();
											setOpenSub(!openSub);
											handleClick(index);
										}}
									>
										<ListItemIcon size="small" edge="start" color="inherit" aria-label="menu">
											{item.icon}
										</ListItemIcon>
										<ListItemText primary={item.description} />
										{hasChildren && (openSub ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
									</ListItemButton>
								</ListItem>
							);
						} else {
							return (
								<Collapse in={openSub} timeout="auto" unmountOnExit key={index}>
									<List component="div" disablePadding>
										<ListItemButton
											sx={{ pl: 4 }}
											component="a"
											href={item.route}
											onClick={(event) => {
												event.stopPropagation();
											}}
										>
											<ListItemIcon size="small" edge="start" color="inherit" aria-label="menu">
												{item.icon}
											</ListItemIcon>
											<ListItemText primary={item.description} />
										</ListItemButton>
									</List>
								</Collapse>
							);
						}
					})}
				</List>

				<Divider />
			</Box>
		</Suspense>
	);

	if (!galleryData) {
		return <LoadingMessage />;
	}
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
					<Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
						Alessandro - Portfólio
					</Typography>
					{
						user ? (
							<div style={{ display: 'flex', alignContent: "center", alignItems: "center", marginLeft: 10 }}>
								<Avatar alt={user.userName} src={user.photoURL} />
								<nav>
									<IconButton onClick={handleLogout}
										size="small"
										aria-label="account of current user"
										aria-controls="menu-appbar"
										aria-haspopup="true"
										color="inherit"
									>
										<LogoutIcon />
									</IconButton>
								</nav>
							</div>
						) : (
							<div>
								<nav>
									<Link to="/Login">
										<IconButton
											size="medium"
											aria-label="account of current user"
											aria-controls="menu-appbar"
											aria-haspopup="true"
											color="inherit"
										>
											<AccountCircle />
										</IconButton>
									</Link>
								</nav>
							</div>
						)
					}
				</Toolbar>
			</AppBar>
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</div>
	);
}

export default TemporaryDrawer;
