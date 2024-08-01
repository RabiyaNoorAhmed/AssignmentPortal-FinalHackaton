import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, CssBaseline, useMediaQuery, useTheme, Container } from '@mui/material';
import './Notes.css';

const Notes = () => {
  const [course, setCourse] = useState('');
  const [batch, setBatch] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedSection, setSelectedSection] = useState('Notes Lectures');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery('(max-width: 500px)');

  const handleSectionChange = (section) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedSection(section);
      setLoading(false);
    }, 500);
  };

  const handleViewAssignments = () => {
    const dummyAssignments = [
      { title: 'Notes Lecture 1', date: '2023-07-20', content: 'Chapter 1', link: 'http://example.com', file: 'lecture1.pdf' },
      { title: 'Notes Lecture 2', date: '2023-07-21', content: 'Chapter 2', link: 'http://example.com', file: 'lecture2.pdf' },
    ];
    setAssignments(dummyAssignments);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'Notes Lectures':
        return (
          <div className='boxshadow1'>
            <Typography variant="h4" gutterBottom>
              Lecture Notes
            </Typography>
            <Box className="Box" sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: isSmallScreen ? 'column' : 'row' }}>
              <Select value={course} onChange={(e) => setCourse(e.target.value)} fullWidth displayEmpty>
                <MenuItem value="" disabled>Select Course</MenuItem>
                <MenuItem value="Web and App Development">Web and App Development</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="Machine Learning">Machine Learning</MenuItem>
              </Select>
              <Select value={batch} onChange={(e) => setBatch(e.target.value)} fullWidth displayEmpty>
                <MenuItem value="" disabled>Select Batch</MenuItem>
                <MenuItem value="Batch 12">Batch 12</MenuItem>
                <MenuItem value="Batch 13">Batch 13</MenuItem>
                <MenuItem value="Batch 14">Batch 14</MenuItem>
              </Select>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleViewAssignments}
              disabled={!course || !batch}
            >
              View Notes Lectures
            </Button>
            {assignments.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Notes Lectures
                </Typography>
                <TableContainer component={Paper}>
                  <Table size={isSmallScreen ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell>Link</TableCell>
                        <TableCell>File</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((assignment, index) => (
                        <TableRow key={index}>
                          <TableCell>{assignment.title}</TableCell>
                          <TableCell>{assignment.date}</TableCell>
                          <TableCell>{assignment.content}</TableCell>
                          <TableCell><a href={assignment.link} target="_blank" rel="noopener noreferrer">View Link</a></TableCell>
                          <TableCell><a href={assignment.file} download>{assignment.file}</a></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </div>
        );
      default:
        return <Typography variant="h5">Select a section from the sidebar</Typography>;
    }
  };

  return (
    <Box className="main-container">
      <CssBaseline />
      <Container className="content-container">
        <Box
          sx={{
            borderRadius: 2,
            p: isMobile ? 1 : 2, // Reduced padding
            mb: 3,
            backgroundColor: 'background.paper',
          }}
        >
          {loading ? <div>Loading...</div> : renderContent()}
        </Box>
      </Container>
    </Box>
  );
};

export default Notes;
