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

  const { data: category, isLoading: isFetching } = useFetchCategoryByUuidQuery(
    uuid,
    { skip: !uuid }
  );

  const [removeCategory, { isLoading: isRemoving, error: removeError }] =
    useRemoveCategoryMutation();

  const handleRemoveCategory = useCallback(async () => {
    if (!category?.uuid) {
      return;
    }
    const result = await removeCategory(category.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [category?.uuid, handleModalClose, removeCategory]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isFetching || isRemoving}
        size='large'
        variant='contained'
        onClick={handleRemoveCategory}
      >
        Видалити
      </Button>,
    ],
    [isFetching, isRemoving, handleRemoveCategory]
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
      error={removeError?.data}
      title='Видалення категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryRemovePage;
