import { useState } from 'react';

import { ESTABLISHMENT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import FileUpload from '../../FileUpload/FileUpload';
import BaseForm from '../BaseForm/BaseForm';

function EstablishmentForm({
  establishment = null,
  onSubmit,
  onUploadLogo,
  onRemoveLogo,
}) {
  const [uploading, setUploading] = useState(false);

  const initialValues = establishment
    ? {
        title: establishment.title,
        description: establishment.description,
        url: establishment.url,
      }
    : { title: '', description: '', url: '' };

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
      {establishment?.uuid && (
        <FileUpload
          entity='establishments'
          file={establishment.logo}
          label={
            establishment?.logo ? 'Оновити логотип' : 'Завантажити логотип'
          }
          uploading={uploading}
          onRemove={onRemoveLogo}
          onUpload={async (file) => {
            setUploading(true);
            await onUploadLogo(file);
            setUploading(false);
          }}
        />
      )}
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        submitButtonText={establishment ? 'Зберегти зміни' : 'Додати заклад'}
        validationSchema={ESTABLISHMENT_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default EstablishmentForm;
