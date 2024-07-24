import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Container, Avatar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/images/logo.png';

function Header({ isAuthenticated, onLogout, userAvatar }) {
  const location = useLocation();
  const isOnLoginPage = location.pathname === '/'; // Adjust this if the login is on a different route or part of Homepage

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: "#fbfbfb",
        height: '70px', // Set specific height for the AppBar
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          paddingLeft: '0px !important', // Remove container padding
          paddingRight: '0px !important',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: '48px', // Set specific height for the Toolbar
            height: '48px',
            padding: '0 16px', // Set padding explicitly
          }}
        >
          <Link to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              sx={{ padding: 0 }} // Remove default padding
            >
              <img src={Logo} alt="Logo" style={{ maxHeight: '100px' }} />
            </IconButton>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            {!isAuthenticated && isOnLoginPage && (
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#3b71ca',
                    color: 'white',
                    minHeight: '32px', // Reduce button height
                    lineHeight: 'normal', // Adjust line height
                    fontSize: '0.875rem', // Adjust font size
                    padding: '4px 12px', // Adjust padding
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            )}
            {!isAuthenticated && !isOnLoginPage && location.pathname === '/register' && (
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#3b71ca',
                    color: 'white',
                    minHeight: '32px', // Reduce button height
                    lineHeight: 'normal', // Adjust line height
                    fontSize: '0.875rem', // Adjust font size
                    padding: '4px 12px', // Adjust padding
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Avatar alt="User Avatar" src={userAvatar} sx={{ width: 32, height: 32, marginRight: 1 }} />
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onLogout}
                  sx={{
                    minHeight: '32px',
                    lineHeight: 'normal',
                    fontSize: '0.875rem',
                    padding: '4px 12px',
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
            sx={{ display: { xs: 'block', md: 'none' }, padding: 0 }} // Remove default padding
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;


