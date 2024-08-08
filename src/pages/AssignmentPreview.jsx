import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { UserContext } from '../context/userContext';
import Loader from '../components/loader/Loader';
import SubmitAssignment from './SubmitAssignment';
import './AssignmentPreview.css'

const AssignmentPreview = ({ onNavigateToSubmit }) => {
  const { currentUser } = useContext(UserContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [currentUser.course, currentUser.batch]);

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
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAssignment(null);
  };

  const handleSubmitAssignment = async () => {
    if (selectedAssignment) {
      try {
        await onNavigateToSubmit(selectedAssignment); // Await the promise
        fetchAssignments(); // Refetch assignments after successful submission
      } catch (error) {
        console.error('Submission error:', error);
      }
      handleCloseDialog();
    }
  };

  const handleSubmissionSuccess = (assignmentId) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment._id === assignmentId ? { ...assignment, submitted: true } : assignment
      )
    );
  };

  const getAssignmentStatus = (assignment) => {
    const currentDate = new Date();
    const dueDate = new Date(assignment.dueDate);

    if (assignment.submitted) { // Check if assignment is submitted
      return 'Submitted';
    } else if (currentDate > dueDate) {
      return 'Due Date Passed';
    } else {
      return 'Pending';
    }
  };

  const getStatusButtonProps = (status) => {
    switch (status) {
      case 'Submitted':
        return { color: 'green', text: 'Submitted' };
      case 'Due Date Passed':
        return { color: 'red', text: 'Due Date Passed' };
      default:
        return { color: '#f0e57f', text: 'Pending' }; // Light yellow
    }
  };

  return (
    <Box className="marginBox" sx={{ p: 4 }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography className='fontSize' variant="h4" gutterBottom>
            Assignments for {currentUser.course} - {currentUser.batch}
          </Typography>
          <List>
            {assignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);
              const { color, text } = getStatusButtonProps(status);

              return (
                <ListItem key={assignment._id} className="boxshadow assignment-item" sx={{ mb: 2, borderRadius: '5px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <ListItemText
                        primary={assignment.title}
                        secondary={assignment.description}
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="contained"
                        style={{ backgroundColor: color, color: 'black' }}
                        disabled
                      >
                        {text}
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(assignment)}
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
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
                  <Typography variant="body1" paragraph>
                    Description: {selectedAssignment.description}
                  </Typography>
                  <Typography variant="body1">
                    File:{' '}
                    {selectedAssignment.file ? (
                      <a href={selectedAssignment.file} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    ) : (
                      'No file available'
                    )}
                  </Typography>
                  <Typography variant="body1">
                    Assignment Link:{' '}
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
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                onClick={handleSubmitAssignment}
                color="primary"
                disabled={selectedAssignment && new Date(selectedAssignment.dueDate) < new Date()}
              >
                Submit Assignment
              </Button>
            </DialogActions>
          </Dialog>

          {/* Render SubmitAssignment component when needed */}
          {selectedAssignment && (
            <SubmitAssignment
              assignmentId={selectedAssignment._id}
              onSubmissionSuccess={handleSubmissionSuccess}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default AssignmentPreview;
