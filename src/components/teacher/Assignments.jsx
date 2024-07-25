import React, { useState } from 'react';
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';

const courses = ['Math', 'History', 'Science'];
const batches = ['Batch A', 'Batch B', 'Batch C'];

const initialAssignments = {
  'Math': {
    'Batch A': [
      { id: 1, title: 'Math Homework', dueDate: '2024-08-01', description: 'Complete exercises from chapter 5.', link: '', file: '', totalMarks: 50 },
    ],
    'Batch B': [],
  },
  'History': {
    'Batch A': [
      { id: 2, title: 'History Essay', dueDate: '2024-08-05', description: 'Write an essay on the Renaissance period.', link: '', file: '', totalMarks: 100 },
    ],
    'Batch B': [],
  },
  'Science': {
    'Batch C': [
      { id: 3, title: 'Science Project', dueDate: '2024-08-10', description: 'Prepare a project on renewable energy.', link: '', file: '', totalMarks: 75 },
    ],
  },
};

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  fontSize: '1rem',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(even)': {
    backgroundColor: '#f9f9f9',
  },
});

const AssignmentDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    padding: '16px',
  },
});

const Assignments = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '', link: '', file: null, totalMarks: 0 });

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch('');
    setAssignments([]);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    setAssignments(initialAssignments[selectedCourse]?.[event.target.value] || []);
  };

  const handleOpenDialog = (assignment = null) => {
    setCurrentAssignment(assignment);
    setNewAssignment(assignment ? { ...assignment } : { title: '', dueDate: '', description: '', link: '', file: null, totalMarks: 0 });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    if (currentAssignment) {
      setAssignments(assignments.map(assignment => (assignment.id === currentAssignment.id ? newAssignment : assignment)));
    } else {
      setAssignments([...assignments, { ...newAssignment, id: assignments.length + 1 }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleFileChange = (event) => {
    setNewAssignment({ ...newAssignment, file: event.target.files[0] });
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
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Due Date</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Link</StyledTableCell>
                  <StyledTableCell>File</StyledTableCell>
                  <StyledTableCell>Total Marks</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map(assignment => (
                  <StyledTableRow key={assignment.id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell>{assignment.description}</TableCell>
                    <TableCell>{assignment.link ? <a href={assignment.link} target="_blank" rel="noopener noreferrer">{assignment.link}</a> : 'N/A'}</TableCell>
                    <TableCell>{assignment.file ? <a href={URL.createObjectURL(assignment.file)} target="_blank" rel="noopener noreferrer">View File</a> : 'N/A'}</TableCell>
                    <TableCell>{assignment.totalMarks}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(assignment)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(assignment.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <AssignmentDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentAssignment ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Link"
            fullWidth
            margin="normal"
            value={newAssignment.link}
            onChange={(e) => setNewAssignment({ ...newAssignment, link: e.target.value })}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Marks"
            type="number"
            fullWidth
            margin="normal"
            value={newAssignment.totalMarks}
            onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: e.target.value })}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" component="label" fullWidth>
            Upload File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {newAssignment.file && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Selected File: {newAssignment.file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </AssignmentDialog>
    </Box>
  );
};

export default Assignments;
