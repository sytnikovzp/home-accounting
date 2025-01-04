import { useState } from 'react';
import { format, parse } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Field } from 'formik';
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { stylesFormFieldsHeight } from '../../../styles';

function FormFields({
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
            error={Boolean(touched && error)}
            required={required}
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
  if (type === 'autocomplete') {
    return (
      <Field name={name}>
        {({ field, form }) => {
          const flattenedOptions = Object.entries(options).flatMap(
            ([group, items]) => items.map((item) => ({ ...item, group }))
          );
          const selectedOption = flattenedOptions.find(
            (item) => item.value === field.value
          );
          return (
            <Autocomplete
              getOptionLabel={(option) => option.label}
              groupBy={(option) => option.group}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              options={flattenedOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(touched && error)}
                  helperText={touched && error ? error : ' '}
                  label={label}
                  placeholder={placeholder}
                  required={required}
                />
              )}
              value={selectedOption || null}
              onChange={(event, value) => {
                form.setFieldTouched(name, true);
                form.setFieldValue(name, value?.value || '');
              }}
            />
          );
        }}
      </Field>
    );
  }
  if (type === 'date') {
    return (
      <LocalizationProvider adapterLocale={uk} dateAdapter={AdapterDateFns}>
        <Field name={name}>
          {({ field, form }) => (
            <FormControl fullWidth error={Boolean(touched && error)}>
              <DatePicker
                label={label}
                maxDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required,
                  },
                }}
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
      fullWidth
      as={TextField}
      autoFocus={autoFocus}
      error={Boolean(touched && error)}
      helperText={touched && error ? error : ' '}
      InputProps={{
        endAdornment:
          type === 'password' ? (
            <InputAdornment position='end'>
              <IconButton
                aria-label={
                  showPassword ? 'Приховати пароль' : 'Показати пароль'
                }
                edge='end'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={stylesFormFieldsHeight}
      type={type === 'password' && showPassword ? 'text' : type}
    />
  );
}

export default FormFields;
