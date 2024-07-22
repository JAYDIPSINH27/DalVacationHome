import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import LandingPage from "./pages/LandingPage";
import RoomDetail from "./components/RoomDetail";
import PageNotFound from "./components/PageNotFound";
import ChatClient from "./components/ChatClient";
import ChatAgent from "./components/ChatAgent";
import RoomListing from "./pages/RoomListing";
import RoomDetails from "./pages/RoomDetails";
import RoomBookings from "./pages/RoomBookings";
import TicketDetails from "./pages/TicketDetails";
import AgentTickets from "./pages/AgentTickets";
import AgentSentiment from "./components/AgentSentiment";
import AgentReviews from "./components/AgentReviews";

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
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/home"
                    element={
                        !loggedInRole ? <Navigate to="/roomListing" /> : <Navigate to="/app" />
                    }
                />
                <Route path="/roomDetails" element={<RoomDetails />} />
                <Route path="/roomListing" element={< RoomListing/>} />
                <Route path="/room/:roomId" element={<RoomDetail />} />
                <Route path="/ticket/:ticketId" element={<TicketDetails />} />
                <Route path="/bookings" element={<RoomBookings />} />
                <Route path="/login" element={<SignIn />} />,
                <Route path="/register" element={<Register />} />,
                <Route
                    path="/app"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            {loggedInRole === "client" ? (
                                <Navigate to="/app/client" />
                            ) : <Navigate to="/app/agent" />
                            }
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/app/client"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            <RoomListing />
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
                <Route path="/dashboard" element={<AgentDashboard/>} />
                <Route path="/clientQuery" element={<ChatClient/>} />
                <Route path="/sentiment" element={<AgentSentiment/>} />
                <Route path="/reviews" element={<AgentReviews/>} />
                <Route path="/tickets" element={<AgentTickets/>} />
                <Route path="*" element={<PageNotFound/>} />
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
                    <ToastContainer />
                </AuthenticationContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>
);
