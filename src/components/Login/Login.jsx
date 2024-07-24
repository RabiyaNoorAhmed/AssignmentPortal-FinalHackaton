import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Container, Typography, Avatar } from '@mui/material';
import Logo from '../../assets/images/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Avatar
          src={Logo}
          alt="Logo"
          sx={{ width: 110, height: 110, mb: 0, mx: 'auto' }}
        />
        <Typography variant="h5" gutterBottom>
          Hello <span style={{ color: '#3b71ca' }}>Welcome</span> Back
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Link to="/student" style={{ textDecoration: 'none' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            >
              Login
            </Button>
          </Link>
        </Box>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#3b71ca', fontWeight: 'medium' }}>
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;

