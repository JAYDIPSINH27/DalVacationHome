import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import Navbar from './Navbar';

const ReviewTable = ({ data }) => {
  if (!data) {
    return <Typography variant="h6">No data available</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Room ID</TableCell>
            <TableCell>Comment</TableCell>
            <TableCell>Time Stamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.userName}</TableCell>
              <TableCell>{item.roomId}</TableCell>
              <TableCell>{item.comment}</TableCell>
              <TableCell>{new Date(item.timeStamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AgenReviews = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dummyData = {
    "message": "Review data fetched successfully",
    "items": [
      {
        "userId": "34c824e8-c0b1-7073-965d-abdc008a5de3",
        "userName": "Jaydipsinh Ranjitsinh Padhiyar",
        "roomId": "2",
        "comment": "Not happy at all",
        "timeStamp": "2024-07-22T13:11:08.805Z"
      }
    ]
  };

  useEffect(() => {
    axios.get('https://ndj7bemrz7.execute-api.us-east-1.amazonaws.com/test/review')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // setData(dummyData); // Use dummy data on error
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">Error fetching data: {error.message}</Typography>;
  }

  return (
    <div>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Review Data
      </Typography>
      <ReviewTable data={data} />
    </div>
  );
};

export default AgenReviews;
