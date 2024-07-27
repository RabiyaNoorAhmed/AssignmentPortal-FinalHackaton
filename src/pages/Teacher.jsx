import React, { useState } from 'react';
import { CssBaseline, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, useMediaQuery, useTheme, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NoteIcon from '@mui/icons-material/Note';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import GradeIcon from '@mui/icons-material/Grade'; // Import the new icon
import SettingsIcon from '@mui/icons-material/Settings';
import Dashboard from '../components/teacher/Dashboard';
import CourseOutline from '../components/teacher/CourseOutline';
import LectureNotes from '../components/teacher/LectureNotes';
import Assignments from '../components/teacher/Assignments';
import Chat from '../components/teacher/Chat';
import Header from '../components/header/Header';
import Marking from '../components/teacher/Marking';
import UserProfile from '../components/userprofile/UserProfile';
const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const componentMap = {
  'Dashboard': <Dashboard />,
  'Course Outline': <CourseOutline />,
  'Lecture Notes': <LectureNotes />,
  'Assignments': <Assignments />,
  'Marking': <Marking />,
  'Chat': <Chat />,
  'UserProfile': <UserProfile/>
};

const iconMap = {
  'Dashboard': <DashboardIcon />,
  'Course Outline': <DescriptionIcon />,
  'Course Plan': <EventNoteIcon />,
  'Lecture Notes': <NoteIcon />,
  'Assignments': <AssignmentIcon />,
  'Marking': <GradeIcon />, // Add the new icon for Marking
  'Chat': <ChatIcon />,
  'UserProfile':<SettingsIcon/>
};

function Teacher() {
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapseToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderComponent = () => componentMap[selectedComponent] || <Dashboard />;

  const drawer = (
    <Box
      sx={{
        width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
          boxSizing: 'border-box',
          mt: 9, // Add margin-top to the drawer
        },
      }}
      role="presentation"
    >
      <List>
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
      <Header onDrawerToggle={handleDrawerToggle} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <CssBaseline />
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={isMobile ? mobileOpen :true} // Ensure drawer is always open on desktop
          onClose={handleDrawerToggle}
          sx={{
            width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
              boxSizing: 'border-box',
              mt: 9, // Add margin-top to the drawer paper
            },
          }}
        >
          {drawer}
        </Drawer>
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: drawerOpen ? `${collapsedDrawerWidth}px` : '0',
            mt: 9, // Add margin-top to the main content
          }}
        >
          <Toolbar />
          {renderComponent()}
        </Box>
      </Box>
    </Box>
  );
}

export default Teacher;
