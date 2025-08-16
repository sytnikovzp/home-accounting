import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { ESTABLISHMENT_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import FileUpload from '@/src/components/FileUpload';
import BaseForm from '@/src/components/forms/BaseForm';

function EstablishmentForm({
  isSubmitting,
  isChanging,
  onUpload,
  onReset,
  establishment = null,
  onSubmit,
}) {
  const { uuid, title, description, url, logo } = establishment ?? {};

  const initialValues = useMemo(
    () => ({
      title: title || '',
      description: description || '',
      url: url || '',
    }),
    [title, description, url]
  );

  return (
    <>
      {uuid && (
        <FileUpload
          entity='establishments'
          file={logo}
          isChanging={isChanging}
          label={logo ? 'Оновити логотип' : 'Завантажити логотип'}
          onReset={onReset}
          onUpload={onUpload}
        />
      )}
      <BaseForm
        fields={FORM_RENDER_FIELDS.establishmentFields}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        validationSchema={ESTABLISHMENT_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default EstablishmentForm;
