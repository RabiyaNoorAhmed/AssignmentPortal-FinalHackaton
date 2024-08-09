import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Card, Box, Typography, CardHeader, Container, Grid, Avatar, CircularProgress
} from '@mui/material';
import { pink } from '@mui/material/colors';
import Sidebar from './SideBar';
import AssignmentPreview from './AssignmentPreview';
import SubmitAssignment from './SubmitAssignment';
import Header from '../components/header/Header';
import UserProfile from '../components/userprofile/UserProfile';
import MarkingStu from './MarkingStu';
import Notes from './Notes';
import { UserContext } from '../context/userContext';
import './StudentDashboard.css';
import Loader from '../components/loader/Loader';
export default function StudentDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [loading, setLoading] = useState(true); // Initialize as true to show loader initially
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser && currentUser.course && currentUser.batch) {
      fetchAssignments();
    } else {
      console.warn('Current user data is not yet available or incomplete:', currentUser);
    }
  }, [currentUser]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/count`, {
        params: {
          course: currentUser.course,
          batch: currentUser.batch
        }
      });
      setTotalAssignments(response.data.totalAssignments || 0);
    } catch (error) {
      console.error('Error fetching total assignments:', error.response ? error.response.data : error.message);
    } finally {
      setTimeout(() => {
        setLoading(false); // Stop loading
        setShowLoader(false); // Hide loader
      }, 3000);
    }
  };

  const refreshAssignments = async () => {
    await fetchAssignments();
  };

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleNavigateToSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    handleSectionChange('submit-assignment');
  };

  const handleSubmissionSuccess = (assignmentId) => {
    console.log(`Assignment with ID ${assignmentId} submitted successfully`);
    refreshAssignments();
    refreshAssignments();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Loader />
        </Box>
      );
    }

    if (!currentUser) {
      return <Typography variant="h6">Loading user data...</Typography>;
    }

    switch (selectedSection) {
      case 'view-assignments':
        return <AssignmentPreview onNavigateToSubmit={handleNavigateToSubmit} />;
      case 'submit-assignment':
        return selectedAssignment ? (
          <SubmitAssignment
            assignmentId={selectedAssignment._id}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        ) : (
          <Typography variant="h6">No assignment selected</Typography>
        );
      case 'Notes Lectures':
        return <Notes />;
      case 'MarkingStu':
        return <MarkingStu />;
      case 'User Profile':
        return <UserProfile />;
      default:
        return (
          <>
            <Header />
            <Box sx={{ p: 2 }}>
              <Typography variant="h3" gutterBottom>Dashboard</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  {currentUser && (
                    <Box sx={{ alignItems: 'center', mb: 1, backgroundColor: '#c6d9fe', padding: '10px', borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                      <Avatar alt={currentUser.name} src={currentUser.avatar} sx={{ width: 100, height: 100, marginRight: 1 }} />
                      <Typography variant="body1" sx={{ marginRight: 2, color: 'black', fontSize: '30px' }}>{currentUser.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'black', fontSize: '18px' }}>
                        Batch: {currentUser.batch}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'black', fontSize: '16px' }}>
                        Course: {currentUser.course}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ display: 'flex', alignItems: 'center', backgroundColor: pink[50], cursor: 'pointer' }}
                    onClick={() => handleSectionChange('view-assignments')}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: pink[500] }}>
                          <Typography variant="h6">TA</Typography>
                        </Avatar>
                      }
                      title="Total Assignments"
                      subheader={
                        loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Typography>{totalAssignments || 0}</Typography>
                      
                        )
                      }
                    />
                  </Card>
                </Grid>

                {/* Other cards */}
              </Grid>
            </Box>
          </>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', marginTop: '100px' }}>
      <Sidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} setSelectedSection={setSelectedSection} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 0, paddingRight: 0 }}>
        <Container sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Box sx={{ borderRadius: 2, p: 3, mb: 3, backgroundColor: 'background.paper' }}>
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
