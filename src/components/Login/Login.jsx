import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Container, Typography, Avatar } from '@mui/material';
import Logo from '../../assets/images/logo.png';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, formData, { withCredentials: true });
      const { token, id, name, role, avatar } = response.data;

      // Store token and user details in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({ name, id, role, avatar, token }));

      // Update UserContext
      setCurrentUser({ name, id, role, avatar, token });

      toast.success("Login successful!");

      if (role === 'teacher') {
        navigate('/teacher');
      } else if (role === 'student') {
        navigate('/student');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed!");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
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
        <Box component="form" noValidate autoComplete="off" onSubmit={submitHandler}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Login
          </Button>
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


