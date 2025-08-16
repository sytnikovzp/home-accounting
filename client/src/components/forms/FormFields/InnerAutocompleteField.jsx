import { useCallback, useMemo } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function InnerAutocompleteField({
  field,
  form,
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

  const flattenedOptions = useMemo(
    () =>
      Object.entries(options).flatMap(([group, items]) =>
        items.map((item) => ({ ...item, group }))
      ),
    [options]
  );

  const selectedOption = useMemo(
    () => flattenedOptions.find((item) => item.value === field.value),
    [flattenedOptions, field.value]
  );

  const handleChange = useCallback(
    (event, value) => {
      form.setFieldTouched(name, true);
      form.setFieldValue(name, value?.value || '');
    },
    [form, name]
  );

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
    <Autocomplete
      getOptionLabel={getOptionLabel}
      groupBy={groupBy}
      isOptionEqualToValue={isOptionEqualToValue}
      options={flattenedOptions}
      renderInput={renderInput}
      value={selectedOption || null}
      onChange={handleChange}
    />
  );
}

export default InnerAutocompleteField;
