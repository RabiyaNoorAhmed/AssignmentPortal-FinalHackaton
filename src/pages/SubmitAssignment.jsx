import React, { useState, useContext } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { FileUpload as FileUploadIcon, Link as LinkIcon, Image as ImageIcon } from '@mui/icons-material';
import { UserContext } from '../context/userContext';

const SubmitAssignment = ({ assignmentId, onSubmissionSuccess }) => {
  const { currentUser } = useContext(UserContext);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [submissionType, setSubmissionType] = useState('file');
  const [status, setStatus] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found');
      return;
    }

    if (
      studentName &&
      rollNumber &&
      title &&
      description &&
      ((submissionType === 'file' && file) ||
        (submissionType === 'link' && link) ||
        (submissionType === 'both' && file && link))
    ) {
      try {
        const formData = new FormData();
        formData.append('studentId', currentUser.id);
        formData.append('assignmentId', assignmentId);
        formData.append('name', studentName);
        formData.append('rollNo', rollNumber);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('submissionType', submissionType);

        if (submissionType === 'file' || submissionType === 'both') {
          formData.append('file', file);
        }

        if (submissionType === 'link' || submissionType === 'both') {
          formData.append('link', link);
        }

        const response = await axios.post(
          'http://localhost:5000/api/assignments/submit',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setStatus('Assignment submitted successfully!');
          setIsSubmitted(true);
          // Notify the parent component about the successful submission
          onSubmissionSuccess(assignmentId);
        }
      } catch (error) {
        setStatus('Failed to submit assignment. Please try again.');
        console.error('Error submitting assignment:', error.response?.data || error.message);
      }
    } else {
      setStatus('Please fill all the fields and provide the required submission type.');
    }
  };

  const handleUnsubmit = () => {
    setStudentName('');
    setRollNumber('');
    setTitle('');
    setDescription('');
    setFile(null);
    setLink('');
    setSubmissionType('file');
    setStatus('Assignment has been unsubmitted.');
    setIsSubmitted(false);
  };

  const handleSubmissionTypeChange = (type) => {
    setSubmissionType(type);
  };

  return (
    <div className="boxshadow">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" gutterBottom>
          {isSubmitted ? 'Assignment Submitted' : 'Submit Assignment'}
        </Typography>
        <TextField
          label="Roll Number"
          fullWidth
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
          disabled={isSubmitted}
        />
        <TextField
          label="Student Name"
          fullWidth
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
          disabled={isSubmitted}
        />
        <TextField
          label="Assignment Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitted}
        />
        <TextField
          label="Description/Instructions"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSubmitted}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <IconButton
            color={submissionType === 'file' ? 'primary' : 'default'}
            onClick={() => handleSubmissionTypeChange('file')}
            disabled={isSubmitted}
          >
            <FileUploadIcon />
          </IconButton>
          <IconButton
            color={submissionType === 'link' ? 'primary' : 'default'}
            onClick={() => handleSubmissionTypeChange('link')}
            disabled={isSubmitted}
          >
            <LinkIcon />
          </IconButton>
          <IconButton
            color={submissionType === 'both' ? 'primary' : 'default'}
            onClick={() => handleSubmissionTypeChange('both')}
            disabled={isSubmitted}
          >
            <ImageIcon />
          </IconButton>
        </Box>
        {(submissionType === 'file' || submissionType === 'both') && (
          <>
            <IconButton component="label" color="primary" disabled={isSubmitted} sx={{ mt: 2 }}>
              <FileUploadIcon />
              <input type="file" hidden onChange={handleFileChange} />
            </IconButton>
            {file && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                {file.name}
              </Typography>
            )}
          </>
        )}
        {(submissionType === 'link' || submissionType === 'both') && (
          <TextField
            label="Link"
            fullWidth
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={isSubmitted}
          />
        )}
        {!isSubmitted ? (
          <Button type="submit" variant="contained" color="primary">
            Submit Assignment
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={handleUnsubmit}>
            Unsubmit Assignment
          </Button>
        )}
        {status && (
          <Typography variant="body1" color="success">
            {status}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default SubmitAssignment;
