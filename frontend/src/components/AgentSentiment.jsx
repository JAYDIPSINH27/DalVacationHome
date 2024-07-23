import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { ThumbUp, ThumbDown, SentimentNeutral } from '@mui/icons-material';
import Navbar from './Navbar';
const sentimentColor = (score) => {
  if (score > 0.5) return 'green';
  if (score < -0.5) return 'red';
  return 'yellow';
};

const sentimentIcon = (score) => {
  if (score > 0.5) return <ThumbUp style={{ color: 'green' }} />;
  if (score < -0.5) return <ThumbDown style={{ color: 'red' }} />;
  return <SentimentNeutral style={{ color: 'yellow' }} />;
};

const SentimentTable = ({ data }) => {
  if (!data || !data.items) {
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
            <TableCell>Sentiment Score</TableCell>
            <TableCell>Sentiment Magnitude</TableCell>
            <TableCell>Sentiment</TableCell>
            <TableCell>Time Stamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.userName}</TableCell>
              <TableCell>{item.roomId}</TableCell>
              <TableCell>{item.comment}</TableCell>
              <TableCell style={{ color: sentimentColor(item.sentimentScore) }}>
                {item.sentimentScore.toFixed(2)}
              </TableCell>
              <TableCell>{item.sentimentMagnitude.toFixed(2)}</TableCell>
              <TableCell>{sentimentIcon(item.sentimentScore)}</TableCell>
              <TableCell>{new Date(item.timeStamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dummyData = {
    "message": "Sentiment analysis completed for all feedback items",
    "items": [
      {
        "userId": "user1",
        "userName": "user1Name",
        "roomId": "room1",
        "comment": "Not happy at all",
        "sentimentScore": -0.9,
        "sentimentMagnitude": 0.9,
        "timeStamp": "2024-07-22T02:17:45.834Z"
      },
      {
        "userId": "user2",
        "userName": "userName2",
        "roomId": "room2",
        "comment": "Satisfied",
        "sentimentScore": 0.9,
        "sentimentMagnitude": 0.9,
        "timeStamp": "2024-07-22T02:21:12.213Z"
      },
      {
        "userId": "user3",
        "userName": "userName3",
        "roomId": "room3",
        "comment": "Satisfied",
        "sentimentScore": 0.4,
        "sentimentMagnitude": 0.4,
        "timeStamp": "2024-07-22T02:21:12.213Z"
      }
    ]
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://ndj7bemrz7.execute-api.us-east-1.amazonaws.com/test/sentimentAnalysis',
      headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
        
          }
      })
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
    <div >
        <Navbar/>
      <Typography variant="h4" gutterBottom>
        Sentiment Analysis Results
      </Typography>
      <SentimentTable data={data} />
    </div>
  );
};

export default App;
