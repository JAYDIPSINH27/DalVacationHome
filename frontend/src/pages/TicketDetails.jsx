import React, { useContext } from "react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Avatar,
    IconButton,
    CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTickets } from "../hooks/useTickets";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthenticationContext } from "../AuthenticationContextProvider";
import { toast } from "react-toastify";

const TicketDetails = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { userAttributesMap, userRole, userName } = useContext(
        AuthenticationContext
    );
    const { ticketMap, sendMessageMutation } = useTickets();
    const [message, setMessage] = React.useState("");
    const ticket = ticketMap?.[ticketId].data || null;
    if (!ticket) {
        return <p>Loading...</p>;
    }
    const userId =
        userRole === "client" ? userAttributesMap.current["sub"] : userName;
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await sendMessageMutation.mutateAsync({
            ticketId,
            message,
        });
        setMessage("");
        toast.success("Message in transit!");
    };
    return (
        <>
            <Navbar />
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    <IconButton onClick={() => navigate(userRole ==="client" ? "/bookings" : "/tickets")}>
                        <ArrowBackIcon />
                    </IconButton>
                    <span>Chat with Support</span>
                </Typography>
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">Ticket Details</Typography>
                    <Typography variant="body1">
                        <strong>Booking ID:</strong> {ticket.bookingId}
                    </Typography>
                    <Typography variant="body1">
                        <strong>User:</strong>{" "}
                        {ticket.userId}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Assignee:</strong>{" "}
                        {ticket.assigneeId ?? <CircularProgress size="24px" />}
                    </Typography>
                    
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">Messages</Typography>
                    <List>
                        {ticket.messages.map((msg) => (
                            <ListItem
                                key={msg.messageId}
                                alignItems="flex-start"
                            >
                                <Avatar>
                                    {msg.senderType.charAt(0).toUpperCase()}
                                </Avatar>
                                <div className="flex flex-col mx-2">
                                    <div className="text-sm font-medium">
                                        {msg.sender === userId
                                            ? "You"
                                            : msg.senderType === "client"
                                            ? "Customer"
                                            : "Support"}
                                    </div>
                                    <p>{msg.message}</p>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
                <Paper sx={{ p: 2 }}>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Type your message"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Send
                        </Button>
                    </form>
                </Paper>
            </Box>
        </>
    );
};

export default TicketDetails;
