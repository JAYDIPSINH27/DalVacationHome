import React from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useTickets } from '../hooks/useTickets';
import { Link } from 'react-router-dom';

const AgentTickets = () => {
    const {tickets} = useTickets();
  return (
    <>
    <Navbar />
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Your Assigned Tickets
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>User Id</TableCell>
              <TableCell>Booking ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets?.map(ticket => (
              <TableRow key={ticket.data?.ticketId}>
                <TableCell>{ticket.data?.ticketId}</TableCell>
                <TableCell>{ticket.data?.userId}</TableCell>
                <TableCell>{ticket.data?.bookingId}</TableCell>
                <Button variant='contained' component={Link} to={`/ticket/${ticket.data?.ticketId}`}>Chat with customer</Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container></>
  );
};

export default AgentTickets;
