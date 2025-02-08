import { format, parse } from 'date-fns';
import { uk } from 'date-fns/locale/uk';
import { Field } from 'formik';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import { DatePicker } from '@mui/x-date-pickers';

function DateField({ name, label, required, touched, error }) {
  return (
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
  );
}

export default DateField;
