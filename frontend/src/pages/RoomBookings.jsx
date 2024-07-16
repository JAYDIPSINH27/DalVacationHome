import React from "react";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import useBookings from "../hooks/useBookings";

const RoomBookings = () => {
    const { bookings, isLoading } = useBookings();
    if (isLoading) {
        return (
            <div className="w-screen h-screen overflow-auto flex flex-col items-center">
                <Navbar />
                <CircularProgress />
            </div>
        );
    }
    return (
        <div className="w-screen h-screen overflow-auto flex flex-col items-center">
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>
                    Booking List
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Booking ID</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>User ID</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Room ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Booking Status</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings?.map((booking) => (
                                <TableRow key={booking.bookingId}>
                                    <TableCell>{booking.bookingId}</TableCell>
                                    <TableCell>{booking.startDate}</TableCell>
                                    <TableCell>{booking.endDate}</TableCell>
                                    <TableCell>{booking.userId}</TableCell>
                                    <TableCell>{booking.userName}</TableCell>
                                    <TableCell>{booking.email}</TableCell>
                                    <TableCell>{booking.roomId}</TableCell>
                                    <TableCell>{booking.status}</TableCell>
                                    <TableCell>
                                        {booking.bookingStatus}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            booking.createdAt
                                        ).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};

export default RoomBookings;
