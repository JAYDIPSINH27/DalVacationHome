import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { logout } from "../CognitoHelper";
import { useContext } from "react";
import { AuthenticationContext } from "../AuthenticationContextProvider";

const pages = [{ text: "Add Rooms", link: "/app/add" }];
export default function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    const { loading, userRole } = useContext(AuthenticationContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    DalVacationHome
                </Typography>

                {loading ? null : userRole === "agent" ? (
                    <>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/dashboard"
                        >
                            Dashboard
                        </Button>
                        <Button color="inherit" component={Link} to="/tickets">
                            Assigned Tickets
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/app/client"
                        >
                            Rooms
                        </Button>
                        <Button color="inherit" component={Link} to="/bookings">
                            Bookings
                        </Button>
                    </>
                )}

                <Box sx={{ flexGrow: 1 }} />

                {loading ? null : userRole ? (
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                ) : (
                    <div>
                        <Button color="error" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="info" component={Link} to="/register">
                            Register
                        </Button>
                    </div>
                )}
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={handleClose}
                        component={Link}
                        to="/profile"
                    >
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
