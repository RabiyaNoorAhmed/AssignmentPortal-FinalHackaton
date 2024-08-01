import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Card, CardContent, Button, Grid, useTheme, useMediaQuery
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import Loader from '../components/loader/Loader'; // Import Loader component
import "./StudentDashboard.css";

const AssignmentPreview = ({ course, batch }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true); // State for loader
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/filter?course=${course}&batch=${batch}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignments(response.data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false); // Hide loader after fetching
      }
    };

    if (course && batch) {
      // Simulate a delay for loader
      setTimeout(() => {
        fetchAssignments();
      }, 500); // Simulate delay of 500ms
    }
  }, [course, batch, token]);

  // Handle file download
  const handleDownload = (fileUrl, fileName) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assignment Previews
      </Typography>

      {loading ? (
        <Loader /> // Show loader while fetching data
      ) : (
        assignments.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            No assignments available for this course or batch.
          </Typography>
        ) : (
          assignments.map((assignment, index) => (
            <Card key={assignment._id} sx={{ maxWidth: '100%', margin: 'auto', mt: 3, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom sx={{ mb: 1 }}>
                  {assignment.title} {/* Displaying assignment title */}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {assignment.description} {/* Displaying assignment description */}
                </Typography>

                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      sx={{
                        width: '100%',
                        height: '50px',
                        textAlign: 'center',
                        fontSize: '0.7rem',
                        padding: '16px',
                        boxSizing: 'border-box',
                      }}
                    >
                      Assignment #{index + 1}
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    {assignment.link && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={assignment.link} // Link to view the assignment
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: '100%',
                          height: '50px',
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          padding: '10px',
                          boxSizing: 'border-box',
                        }}
                      >
                        View Assignment Link
                      </Button>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    {assignment.file && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={assignment.file} // Link to view the file
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: '100%',
                          height: '50px',
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          padding: '10px',
                          boxSizing: 'border-box',
                        }}
                      >
                        View File
                      </Button>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        width: '100%',
                        height: '50px',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        backgroundColor: 'gray',
                        padding: '16px',
                        boxSizing: 'border-box',
                      }}
                    >
                      Marks: {assignment.totalMarks}
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        width: '100%',
                        height: '50px',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        backgroundColor: 'error.main',
                        padding: '8px',
                        boxSizing: 'border-box',
                      }}
                    >
                      Deadline:<br /> {assignment.dueDate}
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', height: '100%' ,width:'100%'}}>
                      {assignment.file && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(assignment.file, assignment.title)}
                          sx={{
                            width:'100%',
                            height: '50px',
                            padding: '8px',
                            boxSizing: 'border-box',
                          }}
                        >
                          Download
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )
      )}
    </Box>
  );
};

export default AssignmentPreview;

