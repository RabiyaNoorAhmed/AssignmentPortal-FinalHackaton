import React, { useState, useEffect, useContext } from 'react';
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
import { UserContext } from '../context/userContext'; // Import UserContext
import Loader from '../components/loader/Loader'; // Import the Loader component

const Notes = () => {
  const { currentUser } = useContext(UserContext); // Use UserContext
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [selectedNote, setSelectedNote] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentUser?.course || !currentUser?.batch) return; // Use currentUser from context

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/notes/filter`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { course: currentUser.course, batch: currentUser.batch },
        });
        setNotes(response.data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        // Delay before setting loading to false
        setTimeout(() => setLoading(false), 1000); // Adjust delay as needed
      }
    };

    fetchNotes();
  }, [currentUser?.course, currentUser?.batch]);

  const handleOpenDialog = (note) => {
    setSelectedNote(note);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNote(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notes for {currentUser?.course} - {currentUser?.batch}
      </Typography>
  
      {notes.length > 0 ? (
        <List>
          {notes.map((note) => (
            <ListItem key={note._id} sx={{ mb: 2, borderRadius:'5px' }} className='boxshadow'>
              <ListItemText
                primary={note.title}
                secondary={
                  <>
                    <Typography variant="body1" color="textSecondary">
                      Content: {note.content}
                    </Typography>
                  </>
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog(note)}
                sx={{ mr: 2 }}
              >
                View
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No notes available</Typography>
      )}

      {/* Dialog for Note Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Note Details</DialogTitle>
        <DialogContent>
          {selectedNote && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedNote.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date: {new Date(selectedNote.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Content:
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedNote.content}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Link:
              </Typography>
              <Typography variant="body1">
                {selectedNote.link ? (
                  <a href={selectedNote.link} target="_blank" rel="noopener noreferrer">
                    View Link
                  </a>
                ) : (
                  'No link available'
                )}
              </Typography>
              <Typography variant="body1" gutterBottom>
                File:
              </Typography>
              <Typography variant="body1">
                {selectedNote.file ? (
                  <a href={selectedNote.file} target="_blank" download>
                    Download File
                  </a>
                ) : (
                  'No file available'
                )}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;
