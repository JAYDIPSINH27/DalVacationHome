import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./Login";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import StoreProvider from "./StoreProvider";
import Profile from "./Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
      path: "/profile",
      element: <Profile />,
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
