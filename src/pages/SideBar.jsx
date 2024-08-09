import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import {
  Assignment, Book, BookOutlined, Chat, Person, Menu as MenuIcon, ChevronLeft, Dashboard, MoreVert, Close, Grade
} from '@mui/icons-material';
import UserProfile from '../components/userprofile/UserProfile'; // Import your UserProfile component

export default function Sidebar({ drawerOpen, toggleDrawer, setSelectedSection, selectedSection }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [miniDrawer, setMiniDrawer] = useState(false);

  const handleMiniDrawerToggle = () => {
    setMiniDrawer(!miniDrawer);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    console.log('Selected section:', section); // Debugging: Log the selected section
  };

  const drawerContent = (
    <>
      {/* Only show mini drawer toggle button for desktop */}
      {!isMobile && (
        <IconButton onClick={handleMiniDrawerToggle} sx={{ color: 'silver' }}>
          {miniDrawer ? <MoreVert /> : <ChevronLeft />}
        </IconButton>
      )}
      <Divider />
      <List sx={{ mt: 2 }}>
        <ListItem
          button
          onClick={() => handleSectionChange('Dashboard')}
          sx={{ py: miniDrawer ? 0.75 : 1 }} // Adjust vertical padding for balance
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}> {/* Adjust minWidth for miniDrawer */}
            <Dashboard />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="Dashboard" />}
        </ListItem>
        {/* <ListItem
          button
          onClick={() => handleSectionChange('Course')}
          sx={{ py: miniDrawer ? 0.75 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}>
            <Book />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="Course Outline" />}
        </ListItem> */}
        <ListItem
          button
          onClick={() => handleSectionChange('view-assignments')}
          sx={{ py: miniDrawer ? 0.75 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}>
            <Assignment />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="View Assignments" />}
        </ListItem>
        <ListItem
          button
          onClick={() => handleSectionChange('submit-assignment')}
          sx={{ py: miniDrawer ? 0.75 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}>
            <Assignment />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="Submit Assignment" />}
        </ListItem>
        <ListItem
          button
          onClick={() => handleSectionChange('Notes Lectures')}
          sx={{ py: miniDrawer ? 0.75 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}>
            <BookOutlined />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="Notes Lectures" />}
        </ListItem>
        <ListItem
          button
          onClick={() => handleSectionChange('MarkingStu')}
          sx={{ py: miniDrawer ? 0.75 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}>
            <Grade />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="Assignment Marks" />}
        </ListItem>
        <ListItem
          button
          onClick={() => handleSectionChange('User Profile')}
          sx={{ py: miniDrawer ? 0.75 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}>
            <Person />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="User Profile" />}
        </ListItem>
        <ListItem
          button
          sx={{ py: miniDrawer ? 0.75 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: miniDrawer ? 0 : 56 }}>
            <Chat />
          </ListItemIcon>
          {!miniDrawer && <ListItemText primary="Chat" />}
        </ListItem>
      </List>
    </>
  );

  return (
    <>
      {/* Temporary Drawer for Mobile */}
      <Drawer
        variant='temporary'
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: miniDrawer ? 70 : 240,
            boxSizing: 'border-box',
            marginTop: '75px', // Adjusted margin top
            transition: 'width 0.3s',
            overflowX: 'hidden',
            // background: 'red' // Prevent horizontal scrolling
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer for Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: miniDrawer ? 70 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: miniDrawer ? 70 : 240,
            boxSizing: 'border-box',
            marginTop: '75px', // Adjusted margin top
            transition: 'width 0.3s',
            overflowX: 'hidden', // Prevent horizontal scrolling
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Toggle Button for Mobile */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
          sx={{ mt: 1, mr: 2, color: 'silver', position: 'fixed', top: 65, left: 16, zIndex: 1201 }} // Adjusted margin and position
        >
          {drawerOpen ? <Close /> : <MenuIcon />}
        </IconButton>
      )}

      {/* Conditional rendering of the UserProfile component */}
      {selectedSection === 'User Profile' && (
        <div>
          <p>Selected Section: {selectedSection}</p> {/* Debugging: Display the selected section */}
          <UserProfile />
        </div>
      )}
    </>
  );
}







