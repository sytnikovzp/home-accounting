import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { CalendarToday, Info, Person, Update } from '@mui/icons-material';

import {
  selectCategoriesError,
  selectCategoriesIsLoading,
  selectCurrentCategory,
} from '../../store/selectors/categoriesSelectors';
import { fetchCategoryByUuid } from '../../store/thunks/categoriesThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function CategoryViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const categoryToCRUD = useSelector((state) =>
    selectCurrentCategory(state, uuid)
  );
  const isLoading = useSelector(selectCategoriesIsLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchCategoryByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { title, status, moderation, creation } = categoryToCRUD || {};
  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const data = useMemo(
    () => [
      { icon: Info, label: 'Назва', value: title },
      {
        icon: () => <StatusIcon status={status} />,
        label: 'Статус',
        value: status,
      },
      {
        icon: Person,
        label: 'Автор',
        value: creatorFullName,
        isLink: Boolean(creatorFullName),
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
      },
      ...(moderatorFullName
        ? [
            {
              icon: Person,
              label: 'Модератор',
              value: moderatorFullName,
              isLink: Boolean(moderatorFullName),
              linkTo: moderatorFullName ? `/users/${moderatorUuid}` : '',
            },
          ]
        : []),
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [
      title,
      status,
      creatorFullName,
      creatorUuid,
      moderatorFullName,
      moderatorUuid,
      createdAt,
      updatedAt,
    ]
  );

  return (
    <ModalWindow
      isOpen
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetails data={data} />
          </Box>
        )
      }
      error={error}
      title='Деталі категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryViewPage;
