import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import TextField from "@mui/material/TextField";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        thousandSeparator
        valueIsNumericString
        decimalScale={2}
        fixedDecimalScale
      />
    );
  }
);
interface NubmericProps  {
  onChange?: ( e:any ) => void;
  value?: string | number;
  label?: string;
  readonly?: boolean;
}

export const NumbericTextField = ( { readonly, label = "" , onChange, value }: NubmericProps ) => {

  return (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        InputProps={{
          inputComponent: NumericFormatCustom as any,
          readOnly: readonly
        }}
        disabled
        fullWidth
        sx={{
          width: 250,
          marginRight: "10px",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000000",
        }}}
      />
  );
}