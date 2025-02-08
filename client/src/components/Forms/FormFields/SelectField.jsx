import { Field } from 'formik';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function SelectField({ error, label, name, options, required, touched }) {
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

export default SelectField;
