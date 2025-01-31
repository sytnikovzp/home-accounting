import { ESTABLISHMENT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import FileUpload from '../../FileUpload/FileUpload';
import BaseForm from '../BaseForm/BaseForm';

function EstablishmentForm({
  isSubmitting,
  isChanging,
  onUpload,
  onRemove,
  establishment = null,
  onSubmit,
}) {
  const {
    uuid,
    title = '',
    description = '',
    url = '',
    logo,
  } = establishment ?? {};

  const initialValues = { title, description, url };

  const fields = [
    {
      name: 'title',
      label: 'Назва закладу',
      placeholder: 'Наприклад "АТБ"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис закладу',
      placeholder: 'Наприклад "Один із найбільших..."',
    },
    {
      name: 'url',
      label: 'Веб сайт закладу',
      placeholder: 'Наприклад "https://www.atbmarket.com"',
    },
  ];

  return (
    <>
      {uuid && (
        <FileUpload
          entity='establishments'
          file={logo}
          isChanging={isChanging}
          label={logo ? 'Оновити логотип' : 'Завантажити логотип'}
          onRemove={onRemove}
          onUpload={onUpload}
        />
      )}
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        submitButtonText={uuid ? 'Зберегти зміни' : 'Додати заклад'}
        validationSchema={ESTABLISHMENT_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default EstablishmentForm;
