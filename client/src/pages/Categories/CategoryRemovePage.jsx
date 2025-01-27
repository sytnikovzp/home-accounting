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

  const { data: category, isLoading: isFetching } =
    useFetchCategoryByUuidQuery(uuid);

  const [removeCategory, { isLoading: isDeleting, error }] =
    useRemoveCategoryMutation();

  const handleDeleteCategory = useCallback(async () => {
    if (!category?.uuid) {
      return;
    }
    const result = await removeCategory(category.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [category?.uuid, removeCategory, handleModalClose]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isDeleting}
        size='large'
        variant='contained'
        onClick={handleDeleteCategory}
      >
        Видалити
      </Button>,
    ],
    [isDeleting, handleDeleteCategory]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити категорію «{category?.title}»?
      </Typography>
    );
  }, [isFetching, category?.title]);

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
