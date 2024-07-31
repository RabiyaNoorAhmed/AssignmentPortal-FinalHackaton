import React, { useState } from 'react';
import {
  Box, Typography, Container, Button, Grid, Select, MenuItem, CssBaseline, useMediaQuery, useTheme
} from '@mui/material';
import Sidebar from './SideBar'; // Import Sidebar component
import AssignmentPreview from './AssignmentPreview'; // Import the AssignmentPreview component
import SubmitAssignment from './SubmitAssignment'; // Import the SubmitAssignment component
import Header from '../components/header/Header';
import Loader from '../components/loader/Loader'; // Import Loader component
import UserProfile from '../components/userprofile/UserProfile'; // Import UserProfile component
import './StudentDashboard.css';

export default function StudentDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSection, setSelectedSection] = useState(''); // Track current section
  const [deadline, setDeadline] = useState('2024-08-01'); // Example deadline date
  const [loading, setLoading] = useState(false); // State for loader

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery('(max-width: 500px)');

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSectionChange = (section) => {
    setLoading(true); // Show loader before changing section
    setTimeout(() => {
      setSelectedSection(section);
      setLoading(false); // Hide loader after section change
    }, 500); // Simulate delay
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'view-assignments':
        return (
          <AssignmentPreview
            course={selectedCourse}
            batch={selectedBatch}
            onAddAssignment={() => handleSectionChange('submit-assignment')}
            deadline={deadline} // Passing deadline as prop to AssignmentPreview
          />
        );
      case 'submit-assignment':
        return <SubmitAssignment deadline={deadline} />;
      case 'User Profile':
        return <UserProfile />;
      default:
        return (
          <>
            <Header />
            <div className='boxshadow'>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Student Dashboard
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Select
                        value={selectedCourse}
                        onChange={handleChange(setSelectedCourse)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select Course' }}
                        fullWidth
                        sx={{
                          height: isSmallScreen ? '45px' : '56px',
                          fontSize: isSmallScreen ? '14px' : '16px',
                        }}
                      >
                        <MenuItem value="" disabled>Select Course</MenuItem>
                        <MenuItem value="Graphics Designing">Graphics Designing</MenuItem>
                        <MenuItem value="Web and App Development">Web and App Development</MenuItem>
                        <MenuItem value="Tecno Kids">Tecno Kids</MenuItem>
                        <MenuItem value="UI UX Designing">UI UX Designing</MenuItem>
                        <MenuItem value="Generative Ai & Chatbox">Generative Ai & Chatbox</MenuItem>
                        <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
                        <MenuItem value="Amazon Mastery">Amazon Mastery</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Select
                        value={selectedBatch}
                        onChange={handleChange(setSelectedBatch)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select Batch' }}
                        fullWidth
                        sx={{
                          height: isSmallScreen ? '45px' : '56px',
                          fontSize: isSmallScreen ? '14px' : '16px',
                        }}
                      >
                        <MenuItem value="" >Select Batch</MenuItem>
                        <MenuItem value="Batch 11">Batch 11</MenuItem>
                        <MenuItem value="Batch 12">Batch 12</MenuItem>
                        <MenuItem value="Batch 13">Batch 13</MenuItem>
                        <MenuItem value="Batch 14">Batch 14</MenuItem>
                        <MenuItem value="Batch 15">Batch 15</MenuItem>
                        <MenuItem value="Batch 16">Batch 16</MenuItem>
                        <MenuItem value="Batch 17">Batch 17</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ height: '56px', py: 1.5 }}
                      fullWidth
                      onClick={() => handleSectionChange('view-assignments')}
                    >
                      View Assignments
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </div>
          </>
        );
    }
  };

  return (
    
    <Box sx={{ display: 'flex', marginTop: '100px' }}>
      <CssBaseline />
      <Sidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} setSelectedSection={setSelectedSection} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: isMobile ? 1 : 3 }}>
        <Container>
          <Box
            sx={{
              borderRadius: 2,
              p: isMobile ? 2 : 3,
              mb: 3,
              backgroundColor: 'background.paper',
            }}
          >
            {loading ? <Loader /> : renderContent()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
