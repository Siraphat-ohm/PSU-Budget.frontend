import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button 
            onClick={onClose} 
            color="error"
            variant='contained'
        >
          ยกเลิก
        </Button>
        <Button 
            onClick={onConfirm} 
            color="success"
            variant='contained'
        >
          ตกลง
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
