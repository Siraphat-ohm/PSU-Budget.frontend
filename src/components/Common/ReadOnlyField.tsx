import React from 'react';
import { SxProps, TextField, Tooltip, styled } from '@mui/material';

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
const TextFieldCustom = styled(TextField)(({ theme }) => ({
  border: 'none',
  textDecorationColor: "black"
  }))
  

export const ReadOnlyTextField = ({text,label,tooltip,placeholder,fullWidth = true,multiline = false,sx,name }: Props) => {
  return (
    <Tooltip title={tooltip || text} arrow placement="top">
      <TextFieldCustom
        name={name}
        value={text}
        variant="outlined"
        InputProps={{
          readOnly: true,
          color: "primary"
        }}
        disabled
        fullWidth={fullWidth}
        multiline={multiline}
        label={label}
        placeholder={placeholder}
            sx={{
              ...sx,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
            },
          }}
      />
    </Tooltip>
  );
};
