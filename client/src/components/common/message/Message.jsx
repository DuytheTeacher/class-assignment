import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { forwardRef } from 'react';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Message = (props) => {
  const { message, toggleMessage } = props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    toggleMessage({ isDisplayed: false, content: '' });
  };

  return (
    <>
      {/* Message */}
      <Snackbar
        open={message.isDisplayed}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
          { message.content }
        </Alert>
      </Snackbar>
    </>
  );
};

export default Message;
