
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/loader/Loader'; // Import Loader component

const AssignmentPreview = ({ onNavigateToSubmit }) => {
  const { currentUser } = useContext(UserContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.error('Token not found');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/filter`, {
          params: {
            course: currentUser.course,
            batch: currentUser.batch,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        // Adding a delay before hiding the loader
        setTimeout(() => {
          setLoading(false);
        }, 500); // Delay in milliseconds
      }
    };

    fetchAssignments();
  }, [currentUser.course, currentUser.batch]);

  const handleOpenDialog = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAssignment(null);
  };

  const handleSubmitAssignment = () => {
    if (selectedAssignment) {
      onNavigateToSubmit(selectedAssignment);
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {loading ? (
        <Loader /> // Display loader while loading
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Assignments for {currentUser.course} - {currentUser.batch}
          </Typography>
          <List>
            {assignments.map((assignment) => (
              <ListItem key={assignment._id} sx={{ mb: 2, borderRadius: '5px' }} className='boxshadow'>
                <ListItemText
                  primary={assignment.title}
                  secondary={assignment.description}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(assignment)}
                  sx={{ mr: 2 }}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onNavigateToSubmit(assignment)}
                >
                  Submit Assignment
                </Button>
              </ListItem>
            ))}
          </List>

          {/* Dialog for Assignment Details */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>Assignment Details</DialogTitle>
            <DialogContent>
              {selectedAssignment && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedAssignment.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Due Date: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Total Marks: {selectedAssignment.totalMarks}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Description:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedAssignment.description}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    File:
                  </Typography>
                  <Typography variant="body1">
                    {selectedAssignment.file ? (
                      <a href={selectedAssignment.file} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    ) : (
                      'No file available'
                    )}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Assignment Link:
                  </Typography>
                  <Typography variant="body1">
                    {selectedAssignment.link ? (
                      <a href={selectedAssignment.link} target="_blank" rel="noopener noreferrer">
                        Open Assignment
                      </a>
                    ) : (
                      'No link available'
                    )}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
              <Button onClick={handleSubmitAssignment} color="primary">
                Submit Assignment
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default AssignmentPreview;
