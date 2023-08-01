import React from 'react';
import { SxProps, TextField, Tooltip } from '@mui/material';

interface Props {
  name?: string
  text: string;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  sx?: SxProps;
}

export const ReadOnlyTextField = ({text,label,tooltip,placeholder,fullWidth = true,multiline = false,sx,name }: Props) => {
  return (
    <Tooltip title={tooltip || text} arrow placement="top">
      <TextField
        name={name}
        value={text}
        variant="outlined"
        InputProps={{
          readOnly: true,
        }}
        fullWidth={fullWidth}
        multiline={multiline}
        label={label}
        placeholder={placeholder}
        sx={sx}
      />
    </Tooltip>
  );
};
