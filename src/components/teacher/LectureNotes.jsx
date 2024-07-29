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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const courses = ['Graphics Designing', 'Web and App Development', 'Tecno Kids', 'UI UX Designing', 'Generative Ai & Chatbox', 'Digital Marketing', 'Amazon Mastery'];
const batches = ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'];
const acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

const NotesTable = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [notes, setNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', date: '', content: '', link: '', file: null });
  const token = localStorage.getItem('authToken');
  useEffect(() => {
    if (selectedCourse && selectedBatch) {
      fetchNotes();
    }
  }, [selectedCourse, selectedBatch]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/notes/filter?course=${selectedCourse}&batch=${selectedBatch}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch('');
    setNotes([]);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    setNotes([]);
  };
  const handleOpenDialog = (note = null) => {
    setCurrentNote(note); // Store the note being edited
    setNewNote(note ? { ...note, file: null } : { title: '', date: '', content: '', link: '', file: null });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newNote.title);
      formData.append('date', newNote.date);
      formData.append('content', newNote.content);
      formData.append('link', newNote.link);
      formData.append('course', selectedCourse);
      formData.append('batch', selectedBatch);

      if (newNote.file) {
        formData.append('file', newNote.file);
      }

      if (currentNote && currentNote._id) { 
        const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/notes/${currentNote._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data',
             Authorization: `Bearer ${token}`
           }
        });
        console.log('Note updated:', response.data);
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/notes`, formData, {
          headers: { 'Content-Type': 'multipart/form-data',
             Authorization: `Bearer ${token}`
           }
        });
        console.log('Note created:', response.data);
      }

      fetchNotes();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert(`Failed to save note: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/notes/${id}`);
      console.log('Note deleted:', response.data);
      fetchNotes(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert(`Failed to delete note: ${error.response?.data?.message || error.message}`);
    }
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (acceptedFileTypes.includes(file.type)) {
        setNewNote({ ...newNote, file });
      } else {
        alert('Invalid file type. Please select a PDF or image file.');
      }
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lecture Notes
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
            Add
          </Button>
          <br /><br />
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notes.map(note => (
                  <TableRow key={note.id}>
                    <TableCell>{note.title}</TableCell>
                    <TableCell>{note.date}</TableCell>
                    <TableCell>{note.content}</TableCell>
                    <TableCell>{note.link ? <a href={note.link} target="_blank" rel="noopener noreferrer">{note.link}</a> : ''}</TableCell>
                    <TableCell>
                      {note.file ? (
                        typeof note.file === 'string' ? (
                          <a href={note.file} target="_blank" rel="noopener noreferrer">
                            View File
                          </a>
                        ) : 'Invalid File'
                      ) : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(note)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(note._id)}>
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
        <DialogTitle>{currentNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={newNote.date}
            onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
          <TextField
            label="Link"
            fullWidth
            margin="normal"
            value={newNote.link}
            onChange={(e) => setNewNote({ ...newNote, link: e.target.value })}
          />
          <Button variant="contained" component="label" margin="normal">
            Upload File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {newNote.file && (
            <Typography variant="body2" color="textSecondary" margin="normal">
              Selected File: {newNote.file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotesTable;
