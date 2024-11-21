import { useState } from 'react';
import { Field } from 'formik';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function FormField({
  name,
  label,
  placeholder,
  type = 'text',
  autoFocus = false,
  error,
  touched,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Field
      name={name}
      as={TextField}
      label={label}
      placeholder={placeholder}
      fullWidth
      required
      autoFocus={autoFocus}
      type={type === 'password' && showPassword ? 'text' : type}
      sx={{
        mb: 2,
        '& .MuiFormHelperText-root': {
          minHeight: '20px',
        },
      }}
      InputProps={{
        endAdornment:
          type === 'password' ? (
            <InputAdornment position='end'>
              <IconButton
                aria-label={
                  showPassword ? 'Приховати пароль' : 'Показати пароль'
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
      error={Boolean(touched && error)}
      helperText={touched && error ? error : ' '}
    />
  );
}

export default FormField;
