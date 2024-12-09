import { useState } from 'react';
import { Field } from 'formik';
import { parse, format } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

function FormField({
  name,
  label,
  placeholder,
  required,
  type = 'text',
  options = [],
  autoFocus = false,
  error,
  touched,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();
  if (type === 'select') {
    return (
      <Field name={name}>
        {({ field }) => (
          <FormControl
            fullWidth
            required={required}
            error={Boolean(touched && error)}
          >
            <InputLabel>{label}</InputLabel>
            <Select {...field} label={label}>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{touched && error ? error : ' '}</FormHelperText>
          </FormControl>
        )}
      </Field>
    );
  }
  if (type === 'date') {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
        <Field name={name}>
          {({ field, form }) => (
            <FormControl fullWidth error={Boolean(touched && error)}>
              <DatePicker
                label={label}
                value={
                  field.value
                    ? parse(field.value, 'dd MMMM yyyy', new Date(), {
                        locale: uk,
                      })
                    : null
                }
                views={['year', 'month', 'day']}
                onChange={(date) => {
                  form.setFieldTouched(field.name, true);
                  form.setFieldValue(
                    field.name,
                    date ? format(date, 'dd MMMM yyyy', { locale: uk }) : ''
                  );
                }}
                maxDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required,
                  },
                }}
              />
              <FormHelperText>{touched && error ? error : ' '}</FormHelperText>
            </FormControl>
          )}
        </Field>
      </LocalizationProvider>
    );
  }
  return (
    <Field
      name={name}
      as={TextField}
      label={label}
      placeholder={placeholder}
      fullWidth
      required={required}
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
