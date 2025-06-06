import { useMemo } from 'react';
import { format, parse } from 'date-fns';
import { uk } from 'date-fns/locale/uk';
import { Field } from 'formik';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import { DatePicker } from '@mui/x-date-pickers';

function DateField({ name, label, required, size, touched, error }) {
  const handleDateChange = (date, field, form) => {
    form.setFieldTouched(field.name, true);
    form.setFieldValue(
      field.name,
      date ? format(date, 'dd MMMM yyyy', { locale: uk }) : ''
    );
  };

  const handleDateChangeWithArgs = (field, form) => (date) => {
    handleDateChange(date, field, form);
  };

  const slotProps = useMemo(
    () => ({
      textField: {
        fullWidth: true,
        required,
        size,
      },
    }),
    [required, size]
  );

  const views = useMemo(() => ['year', 'month', 'day'], []);

  return (
    <Field name={name}>
      {({ field, form }) => (
        <FormControl fullWidth error={Boolean(touched && error)}>
          <DatePicker
            label={label}
            maxDate={new Date()}
            slotProps={slotProps}
            value={
              field.value
                ? parse(field.value, 'dd MMMM yyyy', new Date(), {
                    locale: uk,
                  })
                : null
            }
            views={views}
            onChange={handleDateChangeWithArgs(field, form)}
          />
          <FormHelperText>{touched && error ? error : ' '}</FormHelperText>
        </FormControl>
      )}
    </Field>
  );
}

export default DateField;
