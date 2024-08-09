import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Card, Box, Typography, CardHeader, Container, Grid, Avatar, CircularProgress
} from '@mui/material';
import { green, pink, blue } from '@mui/material/colors';
import Sidebar from './SideBar';
import AssignmentPreview from './AssignmentPreview';
import SubmitAssignment from './SubmitAssignment';
import Header from '../components/header/Header';
import UserProfile from '../components/userprofile/UserProfile';
import MarkingStu from './MarkingStu';
import Notes from './Notes';
import ChatApp from '../components/teacher/Chat'
import './StudentDashboard.css';
import { UserContext } from '../context/userContext';

export default function StudentDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalLectures, setTotalLectures] = useState(0);
  const [totalPendingAssignments, setTotalPendingAssignments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser && currentUser.course && currentUser.batch) {
      fetchAssignments();
      fetchLectures();
      fetchPendingAssignments();
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
      setLoading(false);
    }
  };

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/lectures/count`, {
        params: {
          course: currentUser.course,
          batch: currentUser.batch
        }
      });
      setTotalLectures(response.data.totalLectures || 0);
    } catch (error) {
      console.error('Error fetching total lectures:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/pending/count`, {
        params: {
          course: currentUser.course,
          batch: currentUser.batch
        }
      });
      setTotalPendingAssignments(response.data.totalPendingAssignments || 0);
    } catch (error) {
      console.error('Error fetching pending assignments:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
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
    fetchAssignments(); // Refresh assignments after submission
  };

  const renderContent = () => {
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
        case 'ChatApp':
        return <ChatApp />;
      default:
        return (
          <>
            <Header />
            <Box sx={{ p: 2 }}>
              <Typography variant="h3" gutterBottom>Dashboard</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {currentUser && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1, 
                      backgroundColor: '#c6d9fe', 
                      padding: '10px', 
                      borderRadius: '5px', 
                      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                      flexDirection: { xs: 'column', md: 'row' }, 
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      <Avatar alt={currentUser.name} src={currentUser.avatar} sx={{ width: 100, height: 100, marginBottom: { xs: 2, md: 0 }, marginRight: { md: 2 } }} />
                      <Box>
                        <Typography variant="body1" sx={{ color: 'black', fontSize: '30px' }}>{currentUser.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'black', fontSize: '18px' }}>
                          Batch: {currentUser.batch}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'black', fontSize: '16px' }}>
                          Course: {currentUser.course}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ display: 'flex', alignItems: 'center', backgroundColor: pink[50], cursor: 'pointer', width: '100%' }}
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

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ display: 'flex', alignItems: 'center', backgroundColor: green[50], cursor: 'pointer', width: '100%' }}
                    onClick={() => handleSectionChange('view-lectures')}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: green[500] }}>
                          <Typography variant="h6">TL</Typography>
                        </Avatar>
                      }
                      title="Total Lectures"
                      subheader={
                        loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Typography>{totalLectures || 0}</Typography>
                        )
                      }
                    />
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ display: 'flex', alignItems: 'center', backgroundColor: blue[50], cursor: 'pointer', width: '100%' }}
                    onClick={() => handleSectionChange('view-pending-assignments')}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: blue[500] }}>
                          <Typography variant="h6">PA</Typography>
                        </Avatar>
                      }
                      title="Pending Assignments"
                      subheader={
                        loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Typography>{totalPendingAssignments || 0}</Typography>
                        )
                      }
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
    <Box sx={{ display: 'flex', marginTop: '100px', flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} setSelectedSection={setSelectedSection} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: { xs: 1, md: 3 } }}>
        <Container>
          <Box sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, mb: 3, backgroundColor: 'background.paper' }}>
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
