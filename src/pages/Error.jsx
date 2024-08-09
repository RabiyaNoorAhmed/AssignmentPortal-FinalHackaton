import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorImg from '../assets/images/error.png'; // Adjust the path if necessary

const Error = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        bgcolor: 'background.paper',
        p: 3,
      }}
    >
      <Box
        sx={{
          mb: 3,
          '& img': {
            width: '100%',
            maxWidth: 400,
            height: 'auto',
          },
        }}
      >
        <img src={ErrorImg} alt='error' />
      </Box>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Button
        component={Link}
        to='/'
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Go Back Home
      </Button>
    </Container>
  );
};

export default Error;
