import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Container, Typography, Avatar } from '@mui/material';
import Logo from '../../assets/images/logo.png';
import Loader from '../../components/loader/Loader'; // Adjust the import path if necessary
import { UserContext } from '../../context/userContext';

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false); // State to control loading spinner
  const [showLoader, setShowLoader] = useState(false); // State to manage loader visibility

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Show loader while request is being processed
    setShowLoader(true); // Show loader with delay

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, formData, { withCredentials: true });
      const { token, id, name, role, avatar, course, batch } = response.data;

      // Store token and user details in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({ name, id, role, avatar, token, course, batch }));

      // Update UserContext
      setCurrentUser({ name, id, role, avatar, token, course, batch });

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
    } finally {
      // Ensure the loader is displayed for at least 3 seconds
      setTimeout(() => {
        setIsLoading(false); // Hide loader after request completes
        setShowLoader(false); // Hide loader
      }, 3000);
    }
  };

  if (showLoader) {
    return <Loader />;
  }

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


