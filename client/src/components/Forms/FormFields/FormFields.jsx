import { format, parse } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Field } from 'formik';
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import PasswordField from './PasswordField';

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
  const renderSelectField = () => (
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

  const renderAutocompleteField = () => (
    <Field name={name}>
      {({ field, form }) => {
        const flattenedOptions = () =>
          Object.entries(options).flatMap(([group, items]) =>
            items.map((item) => ({ ...item, group }))
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

  const renderDateField = () => (
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

  if (type === 'password') {
    return (
      <PasswordField
        autoFocus={autoFocus}
        error={error}
        label={label}
        name={name}
        placeholder={placeholder}
        required={required}
        touched={touched}
      />
    );
  }
  if (type === 'select') {
    return renderSelectField();
  }
  if (type === 'autocomplete') {
    return renderAutocompleteField();
  }
  if (type === 'date') {
    return renderDateField();
  }

  return (
    <Field
      fullWidth
      as={TextField}
      autoFocus={autoFocus}
      error={Boolean(touched && error)}
      helperText={touched && error ? error : ' '}
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={stylesFormFieldsHeight}
      type={type}
    />
  );
}

export default FormFields;
