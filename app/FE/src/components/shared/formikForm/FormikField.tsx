import React, { useState } from 'react';
import { useField, ErrorMessage } from 'formik';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface FormikFieldProps {
  name: string;
  type: string;
  label: string;
  required?: boolean;
}

const FormikField: React.FC<FormikFieldProps> = ({ name, type, label, required }) => {
  const [field, meta] = useField(name);
  const [_type, setType] = useState<string>(type);
  const isPassword = type === 'password';
  const hasError = meta.touched && meta.error ? true : false;

  const InputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          edge="end"
          onClick={() => setType(_type === 'password' ? 'text' : 'password')}
        >
          {_type === 'password' ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <TextField
      variant="outlined"
      error={hasError}
      helperText={<ErrorMessage name={name} />}
      label={label}
      type={_type}
      required={required}
      InputProps={isPassword ? InputProps : undefined}
      {...field}
    />
  );
};

export default FormikField;
