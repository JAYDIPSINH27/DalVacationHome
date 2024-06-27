import React from 'react';
import { Grid, TextField, Box } from '@mui/material';

function FilterBar({ startDate, setStartDate, endDate, setEndDate, guests, setGuests }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Check-in Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Check-out Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Number of Guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default FilterBar;
