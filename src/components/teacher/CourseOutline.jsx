import React, { useState, useEffect } from 'react';
import { Typography, Button, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Grid, Box, Typography as MuiTypography } from '@mui/material';
import { Upload, Delete, Download } from '@mui/icons-material'; // Import icons for actions
import { styled } from '@mui/system';

const FileName = styled(MuiTypography)({
  wordBreak: 'break-word',
});

function CourseOutline() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [courseOptions, setCourseOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [file, setFile] = useState(null); // To store the uploaded file
  const [fileUrl, setFileUrl] = useState(''); // To store the URL of the uploaded file
  const [filesByCourseBatch, setFilesByCourseBatch] = useState({}); // To store files by course and batch

  useEffect(() => {
    // Fetch course options from the server or use a predefined list
    const fetchCourses = async () => {
      // Placeholder data for demo purposes
      const courses = [
        { id: '1', title: 'Mathematics' },
        { id: '2', title: 'History' },
        { id: '3', title: 'Science' },
      ];
      setCourseOptions(courses);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      // Fetch batch options based on selected course from the server or use a predefined list
      const fetchBatches = async () => {
        // Placeholder data for demo purposes
        const batches = [
          { id: '1', title: 'Batch 1' },
          { id: '2', title: 'Batch 2' },
          { id: '3', title: 'Batch 3' },
        ];
        setBatchOptions(batches);
      };

      fetchBatches();
    }
  }, [selectedCourse]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch('');
    setFilesByCourseBatch(prev => ({ ...prev, [event.target.value]: {} })); // Reset file state for new course
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    // Update file URL when batch changes
    const currentFile = filesByCourseBatch[selectedCourse]?.[event.target.value] || null;
    setFile(currentFile);
    setFileUrl(currentFile ? URL.createObjectURL(currentFile) : ''); // Update URL
  };

  const handleUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && selectedCourse && selectedBatch) {
      // Store file by course and batch
      setFile(uploadedFile);
      setFileUrl(URL.createObjectURL(uploadedFile));
      setFilesByCourseBatch(prev => ({
        ...prev,
        [selectedCourse]: {
          ...prev[selectedCourse],
          [selectedBatch]: uploadedFile
        }
      }));
    }
  };

  const handleDelete = () => {
    if (selectedCourse && selectedBatch) {
      // Delete file logic
      setFilesByCourseBatch(prev => ({
        ...prev,
        [selectedCourse]: {
          ...prev[selectedCourse],
          [selectedBatch]: null
        }
      }));
      setFile(null);
      setFileUrl('');
    } else {
      alert('Select a course and batch first');
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.name;
      link.click();
    } else {
      alert('No file available to download');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Course Outline
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="course-select-label">Select Course</InputLabel>
          <Select
            labelId="course-select-label"
            id="course-select"
            value={selectedCourse}
            label="Select Course"
            onChange={handleCourseChange}
          >
            {courseOptions.map((course) => (
              <MenuItem key={course.id} value={course.title}>{course.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel id="batch-select-label">Select Batch</InputLabel>
          <Select
            labelId="batch-select-label"
            id="batch-select"
            value={selectedBatch}
            label="Select Batch"
            onChange={handleBatchChange}
          >
            {batchOptions.map((batch) => (
              <MenuItem key={batch.id} value={batch.title}>{batch.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <input
                  type="file"
                  onChange={handleUpload}
                  style={{ display: 'none' }}
                  id="upload-button"
                />
                <label htmlFor="upload-button">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<Upload />}
                    fullWidth
                  >
                    Upload
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  fullWidth
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  fullWidth
                  disabled={!fileUrl} // Disable if no file is available
                >
                  Download
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {file && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Uploaded File:</Typography>
          <FileName variant="body1">{file.name}</FileName>
        </Box>
      )}
    </div>
  );
}

export default CourseOutline;
