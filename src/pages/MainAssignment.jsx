import React, { useState } from 'react';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Divider, Box, CssBaseline, Container, Paper, Typography, useMediaQuery, useTheme
} from '@mui/material';
import {
  Home, Assignment, Assessment, Notifications, Person, Help, ExitToApp, Menu, ChevronLeft
} from '@mui/icons-material';
import SubmitAssignment from './SubmitAssignment';
import AssignmentPreview from './AssignmentPreview'; // Import the component

export default function MainAssignment() {
  const [selectedSection, setSelectedSection] = useState('assignment-preview'); // Change to 'assignment-preview' to show preview initially
  const [drawerOpen, setDrawerOpen] = useState(false); // Start with sidebar closed on small screens
  const [deadline, setDeadline] = useState('2024-08-01'); // Example deadline date

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen width is small

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'submit-assignment':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Submit Your Assignment
            </Typography>
            <SubmitAssignment deadline={deadline} />
          </Box>
        );
      case 'assignment-preview':
        return <AssignmentPreview onAddAssignment={() => setSelectedSection('submit-assignment')} />;
      // Add cases for other sections as needed
      default:
        return <AssignmentPreview onAddAssignment={() => setSelectedSection('submit-assignment')} />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
          sx={{ mr: 2, color: 'silver', position: 'fixed', top: theme.spacing(2), left: theme.spacing(2), zIndex: theme.zIndex.drawer + 1 }}
        >
          <Menu />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            display: isMobile ? (drawerOpen ? 'block' : 'none') : 'block', // Hide on mobile when closed
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: 1,
          }}
        >
          {isMobile && (
            <IconButton onClick={toggleDrawer} sx={{ color: 'silver' }}>
              <ChevronLeft />
            </IconButton>
          )}
        </Box>
        <Divider />
        <List>
          <ListItem button onClick={() => setSelectedSection('assignment-preview')}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Assignment Preview" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('submit-assignment')}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Submit Assignment" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('home')}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('grades-results')}>
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText primary="Grades/Results" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('notifications')}>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('profile')}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('help-support')}>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help/Support" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('logout')}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Container>
          <Paper sx={{ p: 2 }}>
            {renderContent()}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}