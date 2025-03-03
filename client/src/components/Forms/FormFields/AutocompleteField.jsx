import { useCallback } from 'react';
import { Field } from 'formik';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function AutocompleteField({
  error,
  label,
  name,
  options,
  placeholder,
  required,
  size,
  touched,
}) {
  const getOptionLabel = useCallback((option) => option.label, []);

  const groupBy = useCallback((option) => option.group, []);

  const isOptionEqualToValue = useCallback(
    (option, value) => option.value === value.value,
    []
  );

  const handleChange = useCallback((event, value, form, name) => {
    form.setFieldTouched(name, true);
    form.setFieldValue(name, value?.value || '');
  }, []);

  const renderInput = useCallback(
    (params) => (
      <TextField
        {...params}
        error={Boolean(touched && error)}
        helperText={touched && error ? error : ' '}
        label={label}
        placeholder={placeholder}
        required={required}
        size={size}
      />
    ),
    [touched, error, label, placeholder, required, size]
  );

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
            getOptionLabel={getOptionLabel}
            groupBy={groupBy}
            isOptionEqualToValue={isOptionEqualToValue}
            options={flattenedOptions}
            renderInput={renderInput}
            value={selectedOption || null}
            onChange={(event, value) => handleChange(event, value, form, name)}
          />
        );
      }}
    </Field>
  );
}

export default AutocompleteField;
