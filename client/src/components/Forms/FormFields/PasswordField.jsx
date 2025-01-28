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
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
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
              aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
              edge='end'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={stylesFormFieldsHeight}
      type={showPassword ? 'text' : 'password'}
    />
  );
}

export default PasswordField;
