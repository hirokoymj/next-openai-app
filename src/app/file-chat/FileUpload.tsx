import { Box, Typography, Button } from '@mui/material';

interface FileUploadProps {
  handleUpload: any;
  fileError: any;
}

export const FileUpload = ({ handleUpload, fileError }: FileUploadProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '24px',
        border: '1px solid #ccc',
        marginBottom: '10px',
        backgroundColor: '#fff',
      }}>
      <Typography variant="h5" gutterBottom align="center">
        Get Started
      </Typography>
      <Button
        variant="contained"
        component="label"
        sx={{
          px: 3,
          py: 1.5,
          mb: 2,
          fontWeight: 600,
          borderRadius: '8px',
          backgroundColor: 'primary',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'secondary',
          },
          transition: 'background-color 0.3s ease',
        }}>
        Upload Document (PNG, JPG)
        <input
          type="file"
          hidden
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleUpload}
        />
      </Button>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        Your document will be used for the chat.
      </Typography>
      {fileError && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>{fileError}</p>
      )}
    </Box>
  );
};
