import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Container, Avatar, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/images/logo.png';
import { UserContext } from '../../context/userContext';

function Header() {
  const location = useLocation();
  const isOnLoginPage = location.pathname === '/';
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    // Clear user context
    setCurrentUser(null);

    // Remove token from local storage
    localStorage.removeItem('authToken');

    // Redirect to login page
    window.location.href = '/';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: "#fbfbfb",
        height: '70px',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          paddingLeft: '0px !important',
          paddingRight: '0px !important',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: '48px',
            height: '48px',
            padding: '0 16px',
          }}
        >
          <Link to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              sx={{ padding: 0 }}
            >
              <img src={Logo} alt="Logo" style={{ maxHeight: '100px' }} />
            </IconButton>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            {!currentUser && isOnLoginPage && (
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#3b71ca',
                    color: 'white',
                    minHeight: '32px',
                    lineHeight: 'normal',
                    fontSize: '0.875rem',
                    padding: '4px 12px',
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            )}
            {!currentUser && !isOnLoginPage && location.pathname === '/register' && (
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#3b71ca',
                    color: 'white',
                    minHeight: '32px',
                    lineHeight: 'normal',
                    fontSize: '0.875rem',
                    padding: '4px 12px',
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
            {currentUser && (
              <>
                <Avatar alt={currentUser.name} src={currentUser.avatar} sx={{ width: 32, height: 32, marginRight: 1 }} />
                <Typography variant="body1" sx={{ marginRight: 2, color: 'black' }}>
                  {currentUser.name}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                  sx={{
                    minHeight: '32px',
                    lineHeight: 'normal',
                    fontSize: '0.875rem',
                    padding: '4px 12px',
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#e60000',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', md: 'none' }, padding: 0 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;

