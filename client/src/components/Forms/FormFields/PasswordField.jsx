import { useCallback, useMemo, useState } from 'react';
import { Field } from 'formik';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { stylesFormFieldsHeight } from '../../../styles';

function PasswordField({
  autoFocus,
  error,
  label,
  name,
  placeholder,
  required,
  size,
  touched,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleToggleShowPassword = useCallback(
    () => setIsPasswordVisible((prev) => !prev),
    []
  );

  const handleMouseDownPassword = useCallback(
    (event) => event.preventDefault(),
    []
  );

  const inputProps = useMemo(
    () => ({
      endAdornment: (
        <InputAdornment position='end'>
          <IconButton
            aria-label={
              isPasswordVisible ? 'Приховати пароль' : 'Показати пароль'
            }
            edge='end'
            onClick={handleToggleShowPassword}
            onMouseDown={handleMouseDownPassword}
          >
            {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      ),
    }),
    [handleToggleShowPassword, handleMouseDownPassword, isPasswordVisible]
  );

  return (
    <Field
      fullWidth
      as={TextField}
      autoFocus={autoFocus}
      error={Boolean(touched && error)}
      helperText={touched && error ? error : ' '}
      InputProps={inputProps}
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      size={size}
      sx={stylesFormFieldsHeight}
      type={isPasswordVisible ? 'text' : 'password'}
    />
  );
}

export default PasswordField;
