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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
} from "@mui/material";
import Navbar from "../components/Navbar";
import useBookings from "../hooks/useBookings";
import { useTickets } from "../hooks/useTickets";
import { Link } from "react-router-dom";

const RoomBookings = () => {
    const { bookings, isLoading } = useBookings();
    const { createTicketMutation, bookingTicketMap } = useTickets();
    const [query, setQuery] = React.useState("");
    const [openDialog, setOpenDialog] = React.useState(false);
    const bookingRef = React.useRef(null);
    if (isLoading) {
        return (
            <div className="w-screen h-screen overflow-auto flex flex-col items-center">
                <Navbar />
                <CircularProgress />
            </div>
        );
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await createTicketMutation.mutateAsync({
            message: query,
            bookingId: bookingRef.current.bookingId,
        });
        setOpenDialog(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    return (
        <div className="w-screen h-screen overflow-auto flex flex-col items-center">
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>
                    Booking List
                </Typography>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{"Create Ticket"}</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleFormSubmit}>
                            <TextField
                                label="What's the issue?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Create Ticket
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Booking ID</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Room ID</TableCell>
                                <TableCell>Booking Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings?.map((booking) => (
                                <TableRow key={booking.bookingId}>
                                    <TableCell>{booking.bookingId}</TableCell>
                                    <TableCell>{booking.startDate}</TableCell>
                                    <TableCell>{booking.endDate}</TableCell>
                                    <TableCell>{booking.roomId}</TableCell>
                                    <TableCell>
                                        {booking.bookingStatus}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            booking.createdAt
                                        ).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {bookingTicketMap?.[booking.bookingId] ? (
                                            <Link
                                                to={`/ticket/${
                                                    bookingTicketMap?.[
                                                        booking.bookingId
                                                    ].id
                                                }`}
                                            >
                                                <Button variant="contained">See ticket</Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    if(createTicketMutation.isPending){
                                                        
                                                    }
                                                    bookingRef.current =
                                                        booking;
                                                    setOpenDialog(true);
                                                }}
                                            >
                                                {bookingRef.current?.bookingId === booking.bookingId && createTicketMutation.isPending ? <CircularProgress color="secondary" size="24px"/> : 'Report an issue' }
                                            </Button>
                                        )}
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
