import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Card, Box, Typography, CardHeader, Container, Button, Grid, Avatar, CssBaseline, useMediaQuery, useTheme, CircularProgress
} from '@mui/material';
import { pink, blue, red } from '@mui/material/colors';
import Sidebar from './SideBar'; // Import Sidebar component
import AssignmentPreview from './AssignmentPreview'; // Import the AssignmentPreview component
import SubmitAssignment from './SubmitAssignment'; // Import the SubmitAssignment component
import Notes from './Notes'; // Import Notes component
import MarkingStu from './MarkingStu';
import Header from '../components/header/Header';
import Loader from '../components/loader/Loader'; // Import Loader component
import UserProfile from '../components/userprofile/UserProfile'; // Import UserProfile component
import './StudentDashboard.css';
import { UserContext } from '../context/userContext';

export default function StudentDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSection, setSelectedSection] = useState(''); // Track current section
  const [deadline, setDeadline] = useState('2024-08-01'); // Example deadline date
  const [loading, setLoading] = useState(false); // State for loader
  const [totalAssignments, setTotalAssignments] = useState(0);
  const { currentUser } = useContext(UserContext);

  // Fetch the total assignments based on selected batch and course
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { course: selectedCourse, batch: selectedBatch };
        const assignmentResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/total-assignments`, { params });
        setTotalAssignments(assignmentResponse.data.totalAssignments);
      } catch (error) {
        console.error('Error fetching total assignments:', error.response ? error.response.data : error.message);
      } finally {
        setTimeout(() => {
          setLoading(false); // Hide loader after delay
        }, 500); // Delay in milliseconds
      }
    };

    if (selectedCourse && selectedBatch) {
      fetchData();
    }
  }, [selectedCourse, selectedBatch]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    }, 500); // Delay in milliseconds
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
      case 'Notes Lectures':
        return <Notes />;
      case 'MarkingStu':
        return <MarkingStu />;
      default:
        return (
          <>
            <Header />
            <Box sx={{ p: 2 }}>
              <Typography variant="h3" gutterBottom>
                Dashboard
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  {currentUser && (
                    <Box sx={{ alignItems: 'center', mb: 1, backgroundColor: '#c6d9fe', padding: '10px', borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                      <Avatar alt={currentUser.name} src={currentUser.avatar} sx={{ width: 100, height: 100, marginRight: 1 }} />
                      <Typography variant="body1" sx={{ marginRight: 2, color: 'black', fontSize: '30px' }}>
                        {currentUser.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'black', fontSize: '18px' }}>
                        Batch: {currentUser.batch}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'black', fontSize: '16px' }}>
                        Course: {currentUser.course}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                {/* Total Assignments Card */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ display: 'flex', alignItems: 'center', backgroundColor: pink[50], cursor: 'pointer' }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: pink[500] }}>
                          TA
                        </Avatar>
                      }
                      title="Total Assignments"
                      subheader={loading ? <CircularProgress size={24} /> : totalAssignments}
                    />
                  </Card>
                </Grid>

                {/* Other Cards */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ display: 'flex', alignItems: 'center', backgroundColor: blue[50], cursor: 'pointer' }}
                    onClick={() => handleSectionChange('view-assignments')}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: blue[500] }}>
                          Sub
                        </Avatar>
                      }
                      title="Submissions"
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ display: 'flex', alignItems: 'center', backgroundColor: red[50], cursor: 'pointer' }}
                    onClick={() => handleSectionChange('missingAssignments')}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: red[500] }}>
                          MA
                        </Avatar>
                      }
                      title="Missing Assignments"
                    />
                  </Card>
                </Grid>
              </Grid>
            </Box>
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
