import { Field } from 'formik';

import InnerAutocompleteField from './InnerAutocompleteField';

function AutocompleteField({ name, ...restProps }) {
  return (
    <Field name={name}>
      {(fieldProps) => (
        <InnerAutocompleteField name={name} {...restProps} {...fieldProps} />
      )}
    </Field>
  );
}

export default AutocompleteField;
