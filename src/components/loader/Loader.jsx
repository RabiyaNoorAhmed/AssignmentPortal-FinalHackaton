import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import LoadingGif from '../../assets/gif/gif2.gif';

const Loader = () => {
  return (
    <Backdrop
      open
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}
    >
      <img src={LoadingGif} alt="Loading" style={{ width: '25rem', marginTop: '4rem' }} />
    </Backdrop>
  );
};

export default Loader;
