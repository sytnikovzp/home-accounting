import { MEASURE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function MeasureForm({ isSubmitting, measure = null, onSubmit }) {
  const { title, description } = measure ?? {};

  const initialValues = {
    title: title || '',
    description: description || '',
  };

  const fields = [
    {
      name: 'title',
      label: 'Назва одиниці вимірів',
      placeholder: 'Наприклад "кг"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис',
      placeholder: 'Наприклад "кілограм"',
      required: true,
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      validationSchema={MEASURE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default MeasureForm;
