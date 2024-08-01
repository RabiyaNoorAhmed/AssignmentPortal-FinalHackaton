import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { FileUpload as FileUploadIcon, Link as LinkIcon, Image as ImageIcon } from '@mui/icons-material';
import "./StudentDashboard.css";

const SubmitAssignment = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [submissionType, setSubmissionType] = useState('file'); // file, link, both
  const [status, setStatus] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rollNumber && title && description &&
        ((submissionType === 'file' && file) ||
         (submissionType === 'link' && link) ||
         (submissionType === 'both' && file && link))) {
      setStatus('Assignment submitted successfully!');
      setIsSubmitted(true);
    } else {
      setStatus('Please fill all the fields and provide the required submission type.');
    }
  };

  const handleUnsubmit = () => {
    // Logic to unsubmit the assignment
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
    <div className='boxshadow'>
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
          disabled={isSubmitted} // Disable fields if already submitted
        />
        <TextField
          label="Assignment Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitted} // Disable fields if already submitted
        />
        <TextField
          label="Description/Instructions"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSubmitted} // Disable fields if already submitted
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <IconButton
            color={submissionType === 'file' ? 'primary' : 'default'}
            onClick={() => handleSubmissionTypeChange('file')}
            disabled={isSubmitted} // Disable fields if already submitted
          >
            <FileUploadIcon />
          </IconButton>
          <IconButton
            color={submissionType === 'link' ? 'primary' : 'default'}
            onClick={() => handleSubmissionTypeChange('link')}
            disabled={isSubmitted} // Disable fields if already submitted
          >
            <LinkIcon />
          </IconButton>
          <IconButton
            color={submissionType === 'both' ? 'primary' : 'default'}
            onClick={() => handleSubmissionTypeChange('both')}
            disabled={isSubmitted} // Disable fields if already submitted
          >
            <ImageIcon />
          </IconButton>
        </Box>
        {submissionType === 'file' || submissionType === 'both' ? (
          <>
            <IconButton
              component="label"
              color="primary"
              disabled={isSubmitted}
              sx={{ mt: 2 }}
            >
              <FileUploadIcon />
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </IconButton>
            {file && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                {file.name}
              </Typography>
            )}
          </>
        ) : null}
        {submissionType === 'link' || submissionType === 'both' ? (
          <TextField
            label="Link"
            fullWidth
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={isSubmitted} // Disable fields if already submitted
          />
        ) : null}
        {!isSubmitted ? (
          <Button type="submit" variant="contained" color="primary">
            Submit Assignment
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUnsubmit}
          >
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
