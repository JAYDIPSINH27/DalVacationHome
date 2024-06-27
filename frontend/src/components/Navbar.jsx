import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import CustomButton from "./CustomButton";
import { logout } from "../CognitoHelper";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const pages = [{text:"Add Rooms", link: "/app/add"}];
export default function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        display: { xs: "none", md: "flex" },
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    DalVacationHome
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: "block", md: "none" },
                        }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    {page.text}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        display: { xs: "flex", md: "none" },
                        flexGrow: 1,
                        textDecoration: "none",
                    }}
                >
                    DalVacationHome
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                    {pages.map((page) => (
                        <Button
                            variant="text"
                            key={page}
                            sx={{ my: 2, color: "white", display: "block" }}
                        >
                            <Link to={`${page.link}`}>{page.text}</Link>
                        </Button>
                    ))}
                </Box>
                <CustomButton
                    color="secondary"
                    variant="contained"
                    onClick={handleLogout}
                >
                    Logout
                </CustomButton>
            </Toolbar>
        </AppBar>
    );
}
