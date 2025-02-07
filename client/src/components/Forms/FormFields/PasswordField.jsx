import { useState } from 'react';
import { Field } from 'formik';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { stylesFormFieldsHeight } from '../../../styles';

function PasswordField({
  autoFocus,
  error,
  label,
  name,
  placeholder,
  required,
  touched,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleClickShowPassword = () => setIsPasswordVisible((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Field
      fullWidth
      as={TextField}
      autoFocus={autoFocus}
      error={Boolean(touched && error)}
      helperText={touched && error ? error : ' '}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label={
                isPasswordVisible ? 'Приховати пароль' : 'Показати пароль'
              }
              edge='end'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={stylesFormFieldsHeight}
      type={isPasswordVisible ? 'text' : 'password'}
    />
  );
}

export default PasswordField;
