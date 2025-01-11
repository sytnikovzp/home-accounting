import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { CalendarToday, Info, Person, Update } from '@mui/icons-material';

import {
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoryByUuid,
} from '../../store/selectors/categoriesSelectors';
import { fetchCategoryByUuid } from '../../store/thunks/categoriesThunks';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import UserLink from '../../components/UserLink/UserLink';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import { stylesViewPageBox } from '../../styles';

function CategoryViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const categoryToCRUD = useSelector((state) =>
    selectCategoryByUuid(state, uuid)
  );
  const isLoading = useSelector(selectCategoriesLoading);
  const errorMessage = useSelector(selectCategoriesError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchCategoryByUuid(uuid));
    }
  }, [uuid, dispatch]);

  const { title, status, moderation, creation } = categoryToCRUD || {};
  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetailRow icon={Info} label='Назва' value={title} />
            <ViewDetailRow
              icon={() => <StatusIcon status={status} />}
              label='Статус'
              value={status}
            />
            <ViewDetailRow
              icon={Person}
              label='Автор'
              value={
                <UserLink
                  userFullName={creatorFullName}
                  userUuid={creatorUuid}
                />
              }
            />
            {moderatorFullName && (
              <ViewDetailRow
                icon={Person}
                label='Модератор'
                value={
                  <UserLink
                    userFullName={moderatorFullName}
                    userUuid={moderatorUuid}
                  />
                }
              />
            )}
            <ViewDetailRow
              icon={CalendarToday}
              label='Створено'
              value={createdAt}
            />
            <ViewDetailRow icon={Update} label='Редаговано' value={updatedAt} />
          </Box>
        )
      }
      error={errorMessage}
      title='Деталі категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryViewPage;
