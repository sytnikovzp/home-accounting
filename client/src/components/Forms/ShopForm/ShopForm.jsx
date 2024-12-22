import { useState } from 'react';
// ==============================================================
import { SHOP_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';
import FileUpload from '../../FileUpload/FileUpload';

function ShopForm({ shop = null, onSubmit, onUploadLogo, onRemoveLogo }) {
  const [uploading, setUploading] = useState(false);

  const initialValues = shop
    ? {
        title: shop.title,
        description: shop.description,
        url: shop.url,
      }
    : { title: '', description: '', url: '' };

  const fields = [
    {
      name: 'title',
      label: 'Назва магазину',
      placeholder: 'Наприклад "АТБ"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис магазину',
      placeholder: 'Наприклад "Один із найбільших..."',
    },
    {
      name: 'url',
      label: 'Веб сайт магазину',
      placeholder: 'Наприклад "https://www.atbmarket.com"',
    },
  ];

  return (
    <>
      {shop?.uuid && (
        <FileUpload
          file={shop.logo}
          onUpload={async (file) => {
            setUploading(true);
            await onUploadLogo(file);
            setUploading(false);
          }}
          onRemove={onRemoveLogo}
          label={shop?.logo ? 'Оновити логотип' : 'Завантажити логотип'}
          entity='shops'
          uploading={uploading}
        />
      )}
      <BaseForm
        initialValues={initialValues}
        validationSchema={SHOP_VALIDATION_SCHEME}
        onSubmit={onSubmit}
        fields={fields}
        submitButtonText={shop ? 'Зберегти зміни' : 'Додати магазин'}
      />
    </>
  );
}

export default ShopForm;
