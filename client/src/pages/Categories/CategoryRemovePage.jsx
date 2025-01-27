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

  const handleDeleteCategory = async () => {
    const result = await removeCategory(category.uuid);
    if (result?.data) {
      handleModalClose();
    }
  };

  return (
    <ModalWindow
      isOpen
      actions={[
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
      ]}
      content={
        isFetching ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            Ви впевнені, що хочете видалити категорію «{category?.title}»?
          </Typography>
        )
      }
      error={error?.data}
      title='Видалення категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryRemovePage;
