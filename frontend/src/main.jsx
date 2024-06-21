import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import "./index.css";
import { CircularProgress, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import SignIn from "./SignIn";
import ClientDashboard from "./pages/ClientDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AuthenticationContextProvider, { AuthenticationContext } from "./AuthenticationContextProvider";
import Register from "./Register";
const queryClient = new QueryClient();

const PrivateRoute = ({ children, isAuthenticated }) => {
    console.log({ isAuthenticated });
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = ({ loggedInRole }) => {
    console.log({ loggedInRole });
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        !loggedInRole ? <Navigate to="/login" /> : <Navigate to="/app" />
                    }
                />
                <Route path="/login" element={<SignIn />} />,
                <Route path="/register" element={<Register />} />,
                <Route
                    path="/app"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            {loggedInRole === "client" ? (
                                <Navigate to="/app/client" />
                            ) : (
                                <Navigate to="/app/agent" />
                            )}
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/app/client"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            <ClientDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/app/agent"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            <AgentDashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

const App = () => {
    const {loading, userRole} = useContext(AuthenticationContext);
    if (loading) {
        return <div className="h-screen flex items-center justify-center"><CircularProgress /></div>;
    }
    return <AppRouter loggedInRole={userRole} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <AuthenticationContextProvider>
                    <App />
                </AuthenticationContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>
);
