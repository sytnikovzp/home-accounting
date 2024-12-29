import { useState } from 'react';
// ==============================================================
import { ESTABLISHMENT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';
import FileUpload from '../../FileUpload/FileUpload';

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
          file={establishment.logo}
          onUpload={async (file) => {
            setUploading(true);
            await onUploadLogo(file);
            setUploading(false);
          }}
          onRemove={onRemoveLogo}
          label={
            establishment?.logo ? 'Оновити логотип' : 'Завантажити логотип'
          }
          entity='establishments'
          uploading={uploading}
        />
      )}
      <BaseForm
        initialValues={initialValues}
        validationSchema={ESTABLISHMENT_VALIDATION_SCHEME}
        onSubmit={onSubmit}
        fields={fields}
        submitButtonText={establishment ? 'Зберегти зміни' : 'Додати заклад'}
      />
    </>
  );
}

export default EstablishmentForm;
