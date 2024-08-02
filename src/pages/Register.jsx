import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Logo from '../assets/images/logo.png';
import Loader from '../components/loader/Loader'; // Import the Loader component

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    role: 'student',
    course: '',
    batch: ''
  });
  const [isLoading, setIsLoading] = useState(false); // State to control the loader
  const [showLoader, setShowLoader] = useState(false); // State to manage loader visibility

  // Define courses and batches
  const courses = [
    'Graphics Designing',
    'Web and App Development',
    'Tecno Kids',
    'UI UX Designing',
    'Generative AI & Chatbox',
    'Digital Marketing',
    'Amazon Mastery',
  ];

  const batches = {

    'Graphics Designing': ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'],
    'Web and App Development': ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'],
    'Tecno Kids': ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'],
    'UI UX Designing': ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'],
    'Generative AI & Chatbox': ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'],
    'Digital Marketing': ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'],
    'Amazon Mastery': ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17']
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle batch options based on selected course
    if (e.target.name === 'course') {
      setFormData({ ...formData, batch: '', [e.target.name]: e.target.value });
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true); // Show loader when request starts
    setShowLoader(true); // Show loader with delay

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, formData, { withCredentials: true });
      toast.success("Registration successful! Please log in.");
      navigate('/'); // Redirect to login page
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed!");
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
    <Container sx={{ maxWidth: 'xm', mt: 15 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              borderRadius: 1,
              boxShadow: 3,
              textAlign: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Avatar
              src={Logo}
              alt="Logo"
              sx={{ width: 140, height: 140, mb: 2, mx: 'auto' }}
            />
            <Typography variant="h4" gutterBottom>
              Create An <span style={{ color: '#3b71ca' }}>Account</span>
            </Typography>
            <form onSubmit={submitHandler}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
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
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Are you a:</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={handleInputChange}
                    name="role"
                    label="Are you a:"
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Gender:</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={handleInputChange}
                    name="gender"
                    label="Gender:"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {formData.role === 'student' && (
                <>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={formData.course}
                      onChange={handleInputChange}
                      name="course"
                      label="Course"
                    >
                      {Object.keys(batches).map(course => (
                        <MenuItem key={course} value={course}>{course}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {formData.course && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>Batch</InputLabel>
                      <Select
                        value={formData.batch}
                        onChange={handleInputChange}
                        name="batch"
                        label="Batch"
                      >
                        {batches[formData.course].map(batch => (
                          <MenuItem key={batch} value={batch}>{batch}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 4, width: '100%' }}
              >
                Sign Up
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link to="/" style={{ color: '#3b71ca', fontWeight: 'medium' }}>
                  Login
                </Link>
              </Typography>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
