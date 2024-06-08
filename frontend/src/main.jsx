import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./Login";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import StoreProvider from "./StoreProvider";
import Profile from "./Profile";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <StoreProvider>
                <RouterProvider router={router} />
            </StoreProvider>
        </ThemeProvider>
    </React.StrictMode>
);
