import React from 'react';
import { Typography, Button } from '@mui/material';

function Chat() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to SMIT chat app, a way to communicate efficiently. Click the button below to get started.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        href="https://smit-chat-app.onrender.com" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Get Started
      </Button>
    </div>
  );
}

export default Chat;
