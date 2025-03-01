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
                size={size}
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

export default AutocompleteField;
