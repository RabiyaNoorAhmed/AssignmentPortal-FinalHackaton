import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Card, CardContent, CardMedia, Button, Grid, useTheme, useMediaQuery
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import "./StudentDashboard.css"


const AssignmentPreview = ({ number, title, description, file, deadline, marks, onAddAssignment }) => {
  const [fileURL, setFileURL] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Create and clean up file URL
  useEffect(() => {
    if (file && file instanceof File) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Function to render file preview based on file type
  const renderFilePreview = () => {
    if (!fileURL) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla eius ipsa omnis recusandae iusto esse non voluptates soluta ab eligendi pariatur suscipit enim impedit adipisci quia accusamus, dolorem eos dignissimos?
        </Typography>
      );
    }

    if (file.type.startsWith('image/')) {
      return (
        <CardMedia
          component="img"
          alt={file.name}
          image={fileURL}
          sx={{ maxHeight: isSmallScreen ? 200 : 300, objectFit: 'contain', borderRadius: 1 }}
        />
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={fileURL}
          width="100%"
          height={isSmallScreen ? 200 : 300}
          style={{ border: 'none', borderRadius: 1 }}
          title="PDF Preview"
        />
      );
    }

    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Unsupported file type: {file.type}
      </Typography>
    );
  };

  // Handle file download
  const handleDownload = () => {
    if (!file || !fileURL) return;
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
    <Card  sx={{ maxWidth: '100%', margin: 'auto', mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        {/* Heading */}
        <Typography variant="h6" component="div" gutterBottom sx={{ mb: 2 }}>
          Assignment Preview
        </Typography>

        <Grid container spacing={2} alignItems="center">
          {/* Assignment Number Column */}
          <Grid item xs={12} sm={2}>
            <Button
              variant="outlined"
              sx={{ 
                width: '100%', 
                height: '50px', 
                textAlign: 'center', 
                fontSize: '0.9rem',
                padding: '8px', // Padding for Assignment Number Button
                boxSizing: 'border-box',
              }}
            >
              {number || 'Assignment #'}
            </Button>
          </Grid>

          {/* File Preview Column */}
          <Grid item xs={12} sm={4}>
            {renderFilePreview()}
          </Grid>

          {/* Marks Column */}
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ 
                width: '100%', 
                height: '50px', 
                textAlign: 'center', 
                fontSize: '0.8rem', 
                backgroundColor: 'gray',
                padding: '8px', // Padding for Marks Button
                boxSizing: 'border-box',
              }}
            >
              Marks: {marks || '0'}
            </Button>
          </Grid>

          {/* Deadline Column */}
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="error"
              sx={{ 
                width: '100%', 
                height: '50px', 
                textAlign: 'center', 
                fontSize: '0.8rem', 
                backgroundColor: 'error.main',
                padding: '8px', // Padding for Deadline Button
                boxSizing: 'border-box',
              }}
            >
              Deadline:<br /> {deadline || '2024-08-01'}
            </Button>
          </Grid>

          {/* Add Assignment Column */}
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onAddAssignment}
                sx={{
                  mb: isSmallScreen ? 1 : 0,
                  mr: isSmallScreen ? 0 : 1,
                  color: 'white',
                  padding: '8px', // Padding for Add Assignment Button
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '50px',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                Add Assignment
              </Button>
              {file && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{ 
                    ml: isSmallScreen ? 0 : 1, 
                    height: '50px',
                    padding: '8px', // Padding for Download Button
                    boxSizing: 'border-box',
                  }}
                >
                  Download
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    </div>
  );
};

export default AssignmentPreview;