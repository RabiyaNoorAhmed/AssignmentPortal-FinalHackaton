import React, { useState, useContext, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Box, Typography, FormControl, InputLabel, Select,
  MenuItem, useTheme, IconButton, CircularProgress, DialogTitle, DialogContent, Dialog, Button
} from '@mui/material';
import { styled } from '@mui/system';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Loader from '../loader/Loader';
const StyledTableCell = styled(TableCell)({ fontWeight: 'bold', fontSize: '1rem' });
const StyledTableRow = styled(TableRow)({ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } });
const StatsBox = styled(Box)({ marginBottom: '16px', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' });

const Marking = () => {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { currentUser } = useContext(UserContext);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [marks, setMarks] = useState('');
  const [comments, setComments] = useState('');
  

  const handleOpenDetailsDialog = (submission) => {
    setCurrentSubmission(submission);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setCurrentSubmission(null);
  };

  const handleOpenEditDialog = (submission) => {
    setCurrentSubmission(submission);
    setMarks(submission.marks || '');
    setComments(submission.comments || '');
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentSubmission(null);
    setMarks('');
    setComments('');
  };

  const handleSave = async () => {
    if (currentSubmission) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/assignments/submissions/${currentSubmission._id}`,
          { marks: Number(marks), comments },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update local state
        setSubmissions(submissions.map(submission =>
          submission._id === currentSubmission._id
            ? { ...submission, marks: Number(marks), comments }
            : submission
        ));
        handleCloseEditDialog();
      } catch (error) {
        console.error('Failed to save marks and comments:', error.response ? error.response.data : error.message);
      }
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const course = localStorage.getItem('selectedCourse');
      const batch = localStorage.getItem('selectedBatch');

      if (!token || !course || !batch) {
        console.error('Token, course or batch not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/assignments/filter`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { course, batch },
          }
        );
        setAssignments(response.data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error.response ? error.response.data : error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };

    fetchAssignments();
  }, []);

  const handleAssignmentChange = async (event) => {
    const assignmentId = event.target.value;
    setSelectedAssignment(assignmentId);
    setLoading(true);

    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/assignments/submissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { assignmentId },
        }
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error.response ? error.response.data : error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setShowLoader(false);
      }, 3000);
    }
  };

  const handleLockToggle = (assignmentId) => {
    setAssignments(assignments.map(assignment =>
      assignment._id === assignmentId
        ? { ...assignment, locked: !assignment.locked }
        : assignment
    ));
  };

  const getAssignmentStats = (assignmentId) => {
    const totalStudents = submissions.length;
    const submittedAssignments = submissions.filter(sub => sub.assignmentId === assignmentId).length;
    const assignmentMarks = submissions
      .filter(submission => submission.assignmentId === assignmentId)
      .map(submission => submission.marks);

    const averageMarks = assignmentMarks.length === 0
      ? 0
      : assignmentMarks.reduce((sum, marks) => sum + marks, 0) / assignmentMarks.length;

    const sortedByMarks = submissions
      .filter(submission => submission.assignmentId === assignmentId)
      .sort((a, b) => b.marks - a.marks);

    const topStudent = sortedByMarks[0]?.studentName || 'N/A';
    const bottomStudent = sortedByMarks.slice(-1)[0]?.studentName || 'N/A';
    const missingAssignments = totalStudents - submittedAssignments;

    return {
      submittedAssignments,
      totalStudents,
      averageMarks: averageMarks.toFixed(2),
      topStudent,
      bottomStudent,
      missingAssignments,
      assignmentMarks,
      submissions,
    };
  };
  
  const renderAssignmentStatsChart = () => {
    if (!selectedAssignment) return null;
  
    // Aggregate submission data into Pass/Fail categories
    const totalMarks = selectedAssignmentData?.totalMarks || 100; // Default to 100 if not available
    const passingPercentage = 50;
  
    const passFailData = submissions.reduce(
      (acc, submission) => {
        const percentage = (submission.marks / totalMarks) * 100;
        if (percentage >= passingPercentage) {
          acc.pass++;
        } else {
          acc.fail++;
        }
        return acc;
      },
      { pass: 0, fail: 0 }
    );
  
    const chartData = [
      { name: 'Pass', value: passFailData.pass },
      { name: 'Fail', value: passFailData.fail }
    ];
  
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Pass/Fail Statistics Chart</Typography>
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            <Cell key="cell-0" fill="blue" />
            <Cell key="cell-1" fill="red" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>
    );
  };

  const selectedAssignmentData = assignments.find(assignment => assignment._id === selectedAssignment);

  // Determine Pass/Fail based on percentage (70% criteria)
  const determinePassFail = (marks) => {
    const totalMarks = selectedAssignmentData?.totalMarks || 100; // Use a default value if necessary
    const passingPercentage = 50;
    const percentage = (marks / totalMarks) * 100;
  
    if (percentage >= passingPercentage) {
      return <Typography sx={{ color: 'green' }}>Pass</Typography>;
    } else {
      return <Typography sx={{ color: 'red' }}>Fail</Typography>;
    }
  };
  

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>
        Assignment Marking
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Assignment</InputLabel>
          <Select
            value={selectedAssignment || ''}
            onChange={handleAssignmentChange}
            label="Assignment"
            disabled={loading}
          >
            {assignments.map(assignment => (
              <MenuItem key={assignment._id} value={assignment._id}>
                {assignment.title}
                <IconButton onClick={() => handleLockToggle(assignment._id)} sx={{ ml: 2 }}>
                  {assignment.locked ? <LockIcon /> : <LockOpenIcon />}
                </IconButton>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Loader />
      ) : selectedAssignment ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Total Marks: {selectedAssignmentData ? selectedAssignmentData.totalMarks : 'Loading...'}</Typography>
                <Typography>Total Students: {getAssignmentStats(selectedAssignment).totalStudents}</Typography>
                <Typography>Average Marks: {getAssignmentStats(selectedAssignment).averageMarks}</Typography>
                <Typography>Top Student: {getAssignmentStats(selectedAssignment).topStudent}</Typography>
                <Typography>Failed Student: {getAssignmentStats(selectedAssignment).bottomStudent}</Typography>
               
          
          {renderAssignmentStatsChart()}
        </Box>
      ) : null}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell>Roll No</StyledTableCell>
              <StyledTableCell>Details</StyledTableCell>
              <StyledTableCell>Assignment Links</StyledTableCell>
              <StyledTableCell>Upload Time</StyledTableCell>
              <StyledTableCell>Marks</StyledTableCell>
              <StyledTableCell>Marking</StyledTableCell>
                <StyledTableCell>Pass/Fail</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions
              .filter(submission => submission.assignmentId === selectedAssignment)
              .map(submission => (
                <StyledTableRow key={submission._id}>
                  <TableCell>{submission.studentName}</TableCell>
                  <TableCell>{submission.rollNo}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDetailsDialog(submission)}>View Detail</Button>
                  </TableCell>
                  <TableCell>
                    {submission.fileUrl && submission.link ? (
                      <>
                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                        <br />
                        <a href={submission.link} target="_blank" rel="noopener noreferrer">View Link</a>
                      </>
                    ) : submission.fileUrl ? (
                      <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                    ) : submission.link ? (
                      <a href={submission.link} target="_blank" rel="noopener noreferrer">View Link</a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {submission.marks !== undefined
                          ? `${submission.marks} / ${selectedAssignmentData ? selectedAssignmentData.totalMarks : '...'}` 
                          : `0 / ${selectedAssignmentData ? selectedAssignmentData.totalMarks : '...'}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(submission)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {submission.marks !== undefined ? determinePassFail(submission.marks) : 'Pending'}
                  </TableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          },
        }}
        BackdropProps={{
          style: {
            backdropFilter: 'blur(0.5px)',
            backgroundColor: 'transparent',
          },
        }}
      >
        <DialogTitle sx={{ position: 'relative', padding: '16px', textAlign:'center'}}>
          Assignment Details
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDetailsDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '16px', overflow: 'hidden', maxHeight: 'calc(100vh - 120px)' }}>
          {currentSubmission && (
            <Box>
              <Typography variant="h6" sx={{textAlign:'center', fontWeight:'bold'}}>Title: {currentSubmission.title}</Typography>
              <Typography variant="h6" sx={{textAlign:'center', fontWeight:'bold'}}>Description: {currentSubmission.description}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          },
        }}
        BackdropProps={{
          style: {
            backdropFilter: 'blur(0.5px)',
            backgroundColor: 'transparent',
          },
        }}
      >
        <DialogTitle sx={{ position: 'relative', padding: '16px' }}>

         Add Marks & Comments
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseEditDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '16px', overflow: 'hidden', maxHeight: 'calc(100vh - 120px)' }}>
          {currentSubmission && (
            <Box>
              <TextField
                label="Marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleSave}  color="primary">
                  Add
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                  Update
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Marking;





