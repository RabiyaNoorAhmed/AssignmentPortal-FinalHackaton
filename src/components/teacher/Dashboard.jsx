import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Avatar, CardHeader, Box, MenuItem, FormControl, Select, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import { deepPurple, teal, amber, pink, green, red, blue } from '@mui/material/colors';
import { CSSTransition } from 'react-transition-group';
import '../../index.css'; // Import custom styles

function Dashboard() {
  const [teacherInfo, setTeacherInfo] = useState({ name: '', cnic: '', phoneNumber: '', lastQualification: '', courses: [] });
  const [selectedBatch, setSelectedBatch] = useState('');
  const [filteredData, setFilteredData] = useState({ students: 0, submissions: 0, totalAssignments: 0, missingAssignments: 0 });

  // Dialog state management
  const [openDialog, setOpenDialog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const response = await fetch('http://localhost:5000/api/teacher');
        // const data = await response.json();
        // setTeacherInfo(data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      const selectedCourse = teacherInfo.courses.find(course => course.title === selectedBatch);
      if (selectedCourse) {
        setFilteredData({
          students: selectedCourse.students,
          submissions: selectedCourse.submissions,
          totalAssignments: selectedCourse.totalAssignments,
          missingAssignments: selectedCourse.missingAssignments
        });
      }
    }
  }, [selectedBatch, teacherInfo]);

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

      <br />
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Card sx={{ display: 'flex', flexDirection: 'column', backgroundColor: blue[50], mb: 2 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: blue[500], width: 80, height: 80 }}>
                  {teacherInfo.name.charAt(0)}
                </Avatar>
              }
              title={teacherInfo.name}
              subheader={teacherInfo.cnic}
            />
            <CardContent>
              <Typography variant="h6">Contact Information</Typography>
              <Typography variant="body1">Phone: {teacherInfo.phoneNumber}</Typography>
              <Typography variant="body1">Last Qualification: {teacherInfo.lastQualification}</Typography>
            </CardContent>
          </Card>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="batch-select-label">Select Batch</InputLabel>
              <Select
                labelId="batch-select-label"
                id="batch-select"
                value={selectedBatch}
                label="Select Batch"
                onChange={handleBatchChange}
              >
                {teacherInfo.courses.map((course, index) => (
                  <MenuItem key={index} value={course.title}>{course.title}</MenuItem>
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
              subheader={filteredData.students}
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
              subheader={filteredData.totalAssignments}
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
                <div className="spinner" />
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
