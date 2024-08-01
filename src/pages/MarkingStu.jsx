import React, { useState } from 'react';
import {
  TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Box, Grid
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AssignmentMarks = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [marks, setMarks] = useState(null);

  const courses = ['Graphic Designing', 'Web & App', 'Flutter'];
  const batches = ['Batch 11', 'Batch 12', 'Batch 13'];

  const handleViewMarks = () => {
    // Fetch marks data (mock data here)
    const fetchedMarks = [
      { title: 'Assignment 1', number: 1, marks: 85 },
      { title: 'Assignment 2', number: 2, marks: 90 },
      { title: 'Assignment 3', number: 3, marks: 75 },
    ];
    setMarks(fetchedMarks);
  };

  const isButtonEnabled = rollNumber && name && selectedCourse && selectedBatch;

  const chartData = {
    labels: marks ? marks.map(m => m.title) : [],
    datasets: [
      {
        label: 'Marks',
        data: marks ? marks.map(m => m.marks) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assignment Marks
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormControl fullWidth required>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            label="Select Course"
          >
            {courses.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel>Select Batch</InputLabel>
          <Select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            label="Select Batch"
          >
            {batches.map((batch) => (
              <MenuItem key={batch} value={batch}>
                {batch}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewMarks}
          disabled={!isButtonEnabled}
        >
          View Marks
        </Button>
      </Box>
      {marks && (
        <>
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assignment Marks
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Assignments:</strong>
                </Typography>
                {marks.map((assignment, index) => (
                  <Typography key={index} variant="body2">
                    {assignment.title} (Assignment {assignment.number}): {assignment.marks} Marks
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Marks Chart:</strong>
                </Typography>
                <Bar data={chartData} options={{ responsive: true }} />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AssignmentMarks;
