import { uk } from 'date-fns/locale/uk';
import { Field } from 'formik';

import TextField from '@mui/material/TextField';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import AutocompleteField from './AutocompleteField';
import DateField from './DateField';
import PasswordField from './PasswordField';
import SelectField from './SelectField';

import { stylesFormFieldsHeight } from '../../../styles';

function FormFields({
  name,
  label,
  placeholder,
  required = false,
  size = 'medium',
  type = 'text',
  options = [],
  autoFocus = false,
  error,
  touched,
}) {
  if (type === 'password') {
    return (
      <PasswordField
        autoFocus={autoFocus}
        error={error}
        label={label}
        name={name}
        placeholder={placeholder}
        required={required}
        size={size}
        touched={touched}
      />
    );
  }
  if (type === 'select') {
    return (
      <SelectField
        error={error}
        label={label}
        name={name}
        options={options}
        required={required}
        size={size}
        touched={touched}
      />
    );
  }
  if (type === 'autocomplete') {
    return (
      <AutocompleteField
        error={error}
        label={label}
        name={name}
        options={options}
        placeholder={placeholder}
        required={required}
        size={size}
        touched={touched}
      />
    );
  }
  if (type === 'date') {
    return (
      <LocalizationProvider adapterLocale={uk} dateAdapter={AdapterDateFns}>
        <DateField
          error={error}
          label={label}
          name={name}
          required={required}
          size={size}
          touched={touched}
        />
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
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      size={size}
      sx={stylesFormFieldsHeight}
      type={type}
    />
  );
}

export default FormFields;
