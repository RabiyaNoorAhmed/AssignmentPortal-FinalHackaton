import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const courses = ['Graphics Designing', 'Web and App Development', 'Tecno Kids', 'UI UX Designing', 'Generative Ai & Chatbox', 'Digital Marketing', 'Amazon Mastery'];
const batches = ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'];
const acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

const Assignments = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '', link: '', file: null, totalMarks: 0 });
  const token = localStorage.getItem('authToken'); // Adjust this based on how you store your token

  useEffect(() => {
    if (selectedCourse && selectedBatch) {
      fetchAssignments();
    }
  }, [selectedCourse, selectedBatch]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/filter?course=${selectedCourse}&batch=${selectedBatch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch('');
    setAssignments([]);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    setAssignments([]);
  };

  const handleOpenDialog = (assignment = null) => {
    setCurrentAssignment(assignment); // Store the assignment being edited
    setNewAssignment(assignment ? { ...assignment, file: null } : { title: '', dueDate: '', description: '', link: '', file: null, totalMarks: 0 });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newAssignment.title);
      formData.append('dueDate', newAssignment.dueDate);
      formData.append('description', newAssignment.description);
      formData.append('link', newAssignment.link);
      formData.append('totalMarks', newAssignment.totalMarks);
      formData.append('course', selectedCourse);
      formData.append('batch', selectedBatch);

      if (newAssignment.file) {
        formData.append('file', newAssignment.file);
      }

      if (currentAssignment && currentAssignment._id) {
        const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/assignments/${currentAssignment._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Assignment updated:', response.data);
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/assignments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Assignment created:', response.data);
      }

      fetchAssignments();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save assignment:', error);
      alert(`Failed to save assignment: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Assignment deleted:', response.data);
      fetchAssignments(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      alert(`Failed to delete assignment: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (acceptedFileTypes.includes(file.type)) {
        setNewAssignment({ ...newAssignment, file });
      } else {
        alert('Invalid file type. Please select a PDF or image file.');
      }
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            label="Course"
          >
            {courses.map(course => (
              <MenuItem key={course} value={course}>{course}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={!selectedCourse}>
          <InputLabel>Batch</InputLabel>
          <Select
            value={selectedBatch}
            onChange={handleBatchChange}
            label="Batch"
          >
            {batches.map(batch => (
              <MenuItem key={batch} value={batch}>{batch}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedCourse && selectedBatch && (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            Add Assignment
          </Button>
          <br /><br />
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map(assignment => (
                  <TableRow key={assignment._id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell>{assignment.description}</TableCell>
                    <TableCell>{assignment.link ? <a href={assignment.link} target="_blank" rel="noopener noreferrer">{assignment.link}</a> : ''}</TableCell>
                    <TableCell>
                      {assignment.file ? (
                        typeof assignment.file === 'string' ? (
                          <a href={assignment.file} target="_blank" rel="noopener noreferrer">
                            View File
                          </a>
                        ) : 'Invalid File'
                      ) : ''}
                    </TableCell>
                    <TableCell>{assignment.totalMarks}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(assignment)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(assignment._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentAssignment ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
          />
          <TextField
            label="Link"
            fullWidth
            margin="normal"
            value={newAssignment.link}
            onChange={(e) => setNewAssignment({ ...newAssignment, link: e.target.value })}
          />
          <TextField
            label="Total Marks"
            type="number"
            fullWidth
            margin="normal"
            value={newAssignment.totalMarks}
            onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: Number(e.target.value) })}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload File
            <input
              type="file"
              hidden
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileChange}
            />
          </Button>
          {newAssignment.file && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              File: {newAssignment.file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assignments;
