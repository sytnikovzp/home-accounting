import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchCategoryByUuidQuery,
  useRemoveCategoryMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function CategoryRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: category,
    isFetching,
    error: fetchError,
  } = useFetchCategoryByUuidQuery(uuid, { skip: !uuid });

  const { title } = category ?? {};

  const [removeCategory, { isLoading: isRemoving, error: removeError }] =
    useRemoveCategoryMutation();

  const isLoading = isFetching || isRemoving;
  const error = fetchError || removeError;

  const handleRemoveCategory = useCallback(async () => {
    const result = await removeCategory(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCategory]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isLoading}
        size='large'
        variant='contained'
        onClick={handleRemoveCategory}
      >
        Видалити
      </Button>,
    ],
    [isLoading, handleRemoveCategory]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити категорію «{title}»?
      </Typography>
    );
  }, [isFetching, title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryRemovePage;
