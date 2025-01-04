import { MEASURE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function MeasureForm({ measure = null, onSubmit }) {
  const initialValues = measure
    ? { title: measure.title, description: measure.description }
    : { title: '', description: '' };

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
      submitButtonText={measure ? 'Зберегти зміни' : 'Додати одиницю'}
      validationSchema={MEASURE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default MeasureForm;
