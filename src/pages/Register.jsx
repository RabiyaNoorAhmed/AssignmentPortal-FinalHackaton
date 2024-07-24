import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Avatar, Container, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Logo from '../assets/images/logo.png'; // Adjust the path as necessary
import avatar from '../assets/images/usericon.png';

const Register = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: selectedFile,
    gender: '',
    role: 'patient'
  });

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async event => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    // Handle file upload here
  };

  const submitHandler = async event => {
    event.preventDefault();
    // Handle form submission here
  };

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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap:2 }}>
                <FormControl fullWidth>
                  <InputLabel>Are you a:</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={handleInputChange}
                    name="role"
                    label="Are you a:"
                  >
                    <MenuItem value="patient">Student</MenuItem>
                    <MenuItem value="doctor">Teacher</MenuItem>
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
                    {/* <MenuItem value="">Select</MenuItem> */}
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Prefer Not to Say</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar
                  src={previewURL || avatar}
                  alt="Profile"
                  sx={{ width: 60, height: 60, border: '2px solid #3b71ca', mr: 2 }}
                />
                <Button
                  variant="contained"
                  component="label"
                  sx={{ width: '40%' }}
                >
                  Upload Photo
                  <input
                    type="file"
                    accept=".jpg, .png"
                    hidden
                    onChange={handleFileInputChange}
                  />
                </Button>
              </Box>
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
