import React, { useState, useEffect, useContext } from 'react';
import {
  Typography, Card, CardContent, Grid, Avatar, CardHeader, Box,
  MenuItem, FormControl, Select, InputLabel, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, CircularProgress
} from '@mui/material';
import { deepPurple, teal, amber, pink, green, red, blue } from '@mui/material/colors';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from '../../context/userContext';
import axios from 'axios';

const batches = ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'];
const courses = ['Graphics Designing', 'Web and App Development', 'Tecno Kids', 'UI UX Designing', 'Generative Ai & Chatbox', 'Digital Marketing', 'Amazon Mastery'];

function Dashboard() {
  const [teacherInfo, setTeacherInfo] = useState({ name: '', courses: [] });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [filteredData, setFilteredData] = useState({
    students: 0,
    submissions: 0,
    totalAssignments: 0,
    missingAssignments: 0
  });
  const { currentUser } = useContext(UserContext);

  // Backend Total student
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch teacher info (adjust URL if needed)
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/teacher`);
        setTeacherInfo(response.data);

        // Fetch total students
        const studentResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/students/total-students`);
        setTotalStudents(studentResponse.data.totalStudents);

        // Fetch total assignments
        const assignmentResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/assignments/total-assignments`);
        setTotalAssignments(assignmentResponse.data.totalAssignments);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedBatch) {
      const selectedCourseData = teacherInfo.courses.find(course => course.title === selectedCourse);
      if (selectedCourseData) {
        const batchData = selectedCourseData.batches.find(batch => batch.name === selectedBatch);
        if (batchData) {
          setFilteredData({
            students: batchData.students,
            submissions: batchData.submissions,
            totalAssignments: batchData.totalAssignments,
            missingAssignments: batchData.missingAssignments
          });
        }
      }
    }
  }, [selectedCourse, selectedBatch, teacherInfo]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleDialogOpen = (dialogType) => {
    setOpenDialog(dialogType);
  };

  const handleDialogClose = () => {
    setOpenDialog(null);
  };

  const activeCourses = teacherInfo.courses.filter(course => course.active).length;
  const totalCourses = teacherInfo.courses.length;

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
              <br />
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

        {/* Total Courses Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: amber[50], cursor: 'pointer' }}
            onClick={() => handleDialogOpen('totalCourses')}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: amber[500] }}>
                  TC
                </Avatar>
              }
              title="Total Courses"
              subheader={totalCourses}
            />
          </Card>
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
              subheader={loading ? <CircularProgress size={24} /> : totalStudents}
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

        {/* Active Courses Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: teal[50], cursor: 'pointer' }}
            onClick={() => handleDialogOpen('activeCourses')}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: teal[500] }}>
                  AC
                </Avatar>
              }
              title="Active Courses"
              subheader={activeCourses}
            />
          </Card>
        </Grid>

        {/* Submissions Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: blue[50], cursor: 'pointer' }}
            onClick={() => handleDialogOpen('submissions')}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: blue[500] }}>
                  Sub
                </Avatar>
              }
              title="Submissions"
              subheader={filteredData.submissions}
            />
          </Card>
        </Grid>

        {/* Missing Assignments Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: red[50], cursor: 'pointer' }}
            onClick={() => handleDialogOpen('missingAssignments')}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }}>
                  MA
                </Avatar>
              }
              title="Missing Assignments"
              subheader={filteredData.missingAssignments}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs for each card with custom transition */}
      {['totalCourses', 'totalStudents', 'totalAssignments', 'activeCourses', 'submissions', 'missingAssignments'].map(dialogType => (
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








