

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Typography, Card, Grid, Avatar, CardHeader, Box,
  MenuItem, FormControl, Select, InputLabel, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, CircularProgress
} from '@mui/material';
import { green, pink } from '@mui/material/colors';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from '../../context/userContext';

const batches = ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'];
const courses = ['Graphics Designing', 'Web and App Development', 'Tecno Kids', 'UI UX Designing', 'Generative Ai & Chatbox', 'Digital Marketing', 'Amazon Mastery'];

function Dashboard() {
  const [selectedCourse, setSelectedCourse] = useState(localStorage.getItem('selectedCourse') || '');
  const [selectedBatch, setSelectedBatch] = useState(localStorage.getItem('selectedBatch') || '');
  const [studentCount, setStudentCount] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalLectures, setTotalLectures] = useState(0); // New state for lectures
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCourse && selectedBatch) {
        setLoading(true);
        try {
          const studentResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/students/count`, {
            params: { course: selectedCourse, batch: selectedBatch }
          });
          setStudentCount(studentResponse.data.studentCount);

          const assignmentsResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/count`, {
            params: { course: selectedCourse, batch: selectedBatch }
          });
          setTotalAssignments(assignmentsResponse.data.totalAssignments);

          const lecturesResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/lectures/count`, {
            params: { course: selectedCourse, batch: selectedBatch }
          });
          setTotalLectures(lecturesResponse.data.totalLectures);

        } catch (error) {
          console.error('Error fetching data:', error.response ? error.response.data : error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedCourse, selectedBatch]);

  const handleCourseChange = (event) => {
    const newCourse = event.target.value;
    setSelectedCourse(newCourse);
    localStorage.setItem('selectedCourse', newCourse); // Save to localStorage
  };

  const handleBatchChange = (event) => {
    const newBatch = event.target.value;
    setSelectedBatch(newBatch);
    localStorage.setItem('selectedBatch', newBatch); // Save to localStorage
  };

  const handleDialogOpen = (dialogType) => {
    setOpenDialog(dialogType);
  };

  const handleDialogClose = () => {
    setOpenDialog(null);
  };

  return (
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
            </Box>
          )}

          <Box sx={{ mt: 2, mb: 2 }}>
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
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
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
        </Grid>

        {/* Total Students Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: green[50], cursor: 'pointer' }}
            onClick={() => handleDialogOpen('totalStudents')}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: green[500] }}>
                  S
                </Avatar>
              }
              title="Total Students"
              subheader={loading ? <CircularProgress size={24} /> : studentCount}
            />
          </Card>
        </Grid>

        {/* Total Assignments Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: pink[50], cursor: 'pointer' }}
            onClick={() => handleDialogOpen('totalAssignments')}
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

        {/* Total Lectures Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#e0f7fa', cursor: 'pointer' }}
            onClick={() => handleDialogOpen('totalLectures')}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#00bcd4' }}>
                  TL
                </Avatar>
              }
              title="Total Lectures"
              subheader={loading ? <CircularProgress size={24} /> : totalLectures}
            />
          </Card>
        </Grid>

        {/* Other Cards */}
        {/* Implement similar cards for Total Courses, Active Courses */}
      </Grid>

      {/* Dialogs for each card with custom transition */}
      {['totalCourses', 'totalStudents', 'totalAssignments', 'totalLectures', 'activeCourses'].map(dialogType => (
        <CSSTransition
          in={openDialog === dialogType}
          timeout={500}
          classNames="magic-dialog"
          unmountOnExit
          key={dialogType}
        >
          <Dialog open={openDialog === dialogType} onClose={handleDialogClose}>
            <DialogTitle>{dialogType.replace(/([A-Z])/g, ' $1').toUpperCase()}</DialogTitle>
            <DialogContent>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant="body1">
                  Content for {dialogType.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </CSSTransition>
      ))}
    </Box>
  );
}

export default Dashboard;
