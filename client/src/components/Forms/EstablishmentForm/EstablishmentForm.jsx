import { useCallback } from 'react';

import { ESTABLISHMENT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
import {
  useChangeEstablishmentLogoMutation,
  useResetEstablishmentLogoMutation,
} from '../../../store/services';

import FileUpload from '../../FileUpload/FileUpload';
import BaseForm from '../BaseForm/BaseForm';

function EstablishmentForm({ isLoading, establishment = null, onSubmit }) {
  const {
    uuid,
    title = '',
    description = '',
    url = '',
    logo,
  } = establishment || {};

  const initialValues = { title, description, url };

  const [changeLogo, { isLoading: isUploading, error: uploadError }] =
    useChangeEstablishmentLogoMutation();

  const [resetLogo, { isLoading: isResetting, error: resetError }] =
    useResetEstablishmentLogoMutation();

  const isChanging = isUploading || isResetting;
  const error = uploadError?.data || resetError?.data;

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

  const handleUploadLogo = useCallback(
    async (file) => {
      if (!uuid) {
        return;
      }
      await changeLogo({ establishmentUuid: uuid, establishmentLogo: file });
    },
    [changeLogo, uuid]
  );

  const handleRemoveLogo = useCallback(async () => {
    if (!uuid) {
      return;
    }
    await resetLogo({ establishmentUuid: uuid });
  }, [resetLogo, uuid]);

  return (
    <>
      {uuid && (
        <FileUpload
          entity='establishments'
          error={error}
          file={logo}
          isLoading={isChanging}
          label={logo ? 'Оновити логотип' : 'Завантажити логотип'}
          onRemove={handleRemoveLogo}
          onUpload={handleUploadLogo}
        />
      )}
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        isLoading={isLoading}
        submitButtonText={uuid ? 'Зберегти зміни' : 'Додати заклад'}
        validationSchema={ESTABLISHMENT_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default EstablishmentForm;
