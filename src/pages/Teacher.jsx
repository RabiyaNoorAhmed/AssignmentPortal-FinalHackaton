import React, { useState } from 'react';
import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, useMediaQuery, useTheme, Toolbar
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NoteIcon from '@mui/icons-material/Note';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import GradeIcon from '@mui/icons-material/Grade';
import SettingsIcon from '@mui/icons-material/Settings';
import Dashboard from '../components/teacher/Dashboard';
import LectureNotes from '../components/teacher/LectureNotes';
import Assignments from '../components/teacher/Assignments';
import Chat from '../components/teacher/Chat';
import Header from '../components/header/Header';
import Marking from '../components/teacher/Marking';
import UserProfile from '../components/userprofile/UserProfile';
import "./StudentDashboard.css"; 
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 210;
const collapsedDrawerWidth = 60;

const componentMap = {
  'Dashboard': <Dashboard />,
  'Lecture Notes': <LectureNotes />,
  'Assignments': <Assignments />,
  'Marking': <Marking />,
  'Chat': <Chat />,
  'UserProfile': <UserProfile />
};

const iconMap = {
  'Dashboard': <DashboardIcon />,
  // 'Course Outline': <DescriptionIcon />,
  'Lecture Notes': <NoteIcon />,
  'Assignments': <AssignmentIcon />,
  'Marking': <GradeIcon />,
  'Chat': <ChatIcon />,
  'UserProfile': <SettingsIcon />
};

function Teacher() {
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapseToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderComponent = () => componentMap[selectedComponent] || <Dashboard />;

  const drawerContent = (
    <Box
      sx={{
        width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
          boxSizing: 'border-box',
          mt: 8, // Adjust margin-top to fit your header height
          transition: 'width 0.3s ease', // Smooth transition for width change
        },
      }}
      role="presentation"
    >
      <List sx={{mt:3}}>
        {Object.keys(componentMap).map((text) => (
          <ListItem
            button
            key={text}
            onClick={() => setSelectedComponent(text)}
            aria-label={text}
          >
            <ListItemIcon>
              {iconMap[text]}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ display: drawerOpen ? 'block' : 'none' }} />
          </ListItem>
        ))}
        <ListItem button onClick={handleDrawerCollapseToggle} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton>
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Temporary Drawer for Mobile */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
              boxSizing: 'border-box',
              mt: 9, // Adjust margin-top to fit your header height
              transition: 'width 0.3s ease', // Smooth transition for width change
              overflowX: 'hidden', // Prevent horizontal scrolling
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
            width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
              boxSizing: 'border-box',
              mt: 10, // Adjust margin-top to fit your header height
              transition: 'width 0.3s ease', // Smooth transition for width change
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
            onClick={handleDrawerToggle}
            sx={{ mt: 1, mr: 2, color: 'silver', position: 'fixed', top: 65, left: 16, zIndex: 1201 }} // Adjusted margin and position
          >
            {mobileOpen ? <CloseIcon />:  <MenuIcon />}
          </IconButton>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isMobile ? 1 : 3,
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Prevent scrolling
            transition: 'padding 0.3s ease', // Smooth transition for padding change
          }}
          className="dashboard"
        >
          <Toolbar />
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto', // Allow vertical scrolling if needed
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 3, // Add box shadow for styling
              transition: 'padding 0.3s ease', // Smooth transition for padding change
            }}
            className="boxshadow"
          >
            {renderComponent()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Teacher;
