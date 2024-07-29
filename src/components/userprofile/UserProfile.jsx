import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Avatar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import UserAvatar from '../../assets/images/usericon.png'; // Import default avatar image
import axios from 'axios';
import { UserContext } from '../../context/userContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [avatar, setAvatar] = useState(""); // Set default avatar
  const [avatarFile, setAvatarFile] = useState(null); // Store file object separately
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [error, setError] = useState('');
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${currentUser.id}`,
          { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
        );
        const { name, email, avatar } = response.data;
        setName(name);
        setEmail(email);
        setAvatar(avatar || UserAvatar); // Fallback to default avatar
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (token && currentUser.id) {
      getUser();
    }
  }, [token, currentUser.id]);

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.append('avatar', avatarFile); // Append file object

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/change-avatar`, postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      // Update avatar URL after successful upload
      if (response.status === 200) {
        // Clear user data and navigate to login page
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        navigate('/');
      }
    } catch (error) {
      console.error("Error changing avatar:", error.response?.data || error.message);
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();

    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('currentPassword', currentPassword);
    userData.append('newPassword', newPassword);
    userData.append('confirmNewPassword', confirmNewPassword);

    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/edit-user`, userData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        // Update current user state and localStorage
        setCurrentUser({ ...currentUser, name, email, avatar: response.data.avatarUrl });
        localStorage.setItem('user', JSON.stringify({ ...currentUser, name, email, avatar: response.data.avatarUrl }));
        localStorage.removeItem('authToken');
         //Log User Out
  navigate('/logout')
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container maxWidth="sm" className='profile' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '2rem' }}>
      <div className='profile__details'>
        <div className='avatar__wrapper' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={typeof avatar === 'string' ? avatar : UserAvatar} alt="User Avatar" style={{ width: 150, height: 150 }} />
          <form className='avatar__form' style={{ marginTop: '1rem' }}>
            <input
              type='file'
              name='avatar'
              id='avatar'
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setAvatar(URL.createObjectURL(file)); // Use URL.createObjectURL for preview
                  setAvatarFile(file); // Store file object
                  setIsAvatarTouched(true);
                }
              }}
              accept='image/png, image/jpg, image/jpeg'
            />
            <label htmlFor='avatar'>
              <IconButton component="span" onClick={() => setIsAvatarTouched(true)}>
                <EditIcon />
              </IconButton>
            </label>
            {isAvatarTouched && (
              <IconButton onClick={changeAvatarHandler} color="primary">
                <CheckIcon />
              </IconButton>
            )}
          </form>
        </div>
        <Typography variant='h4' style={{ marginTop: '1rem' }}>
          {name}
        </Typography>
        <form onSubmit={updateUserDetails} style={{ marginTop: '2rem', width: '100%' }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Current Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" style={{ marginTop: '1rem' }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Update
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default UserProfile;



