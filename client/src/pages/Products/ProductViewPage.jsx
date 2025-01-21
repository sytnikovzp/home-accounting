import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import {
  CalendarToday,
  Category,
  Info,
  Person,
  Update,
} from '@mui/icons-material';

import {
  selectCurrentProduct,
  selectProductsError,
  selectProductsIsLoading,
} from '../../store/selectors/productsSelectors';
import { fetchProductByUuid } from '../../store/thunks/productsThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function ProductViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const productToCRUD = useSelector((state) =>
    selectCurrentProduct(state, uuid)
  );
  const isLoading = useSelector(selectProductsIsLoading);
  const errorMessage = useSelector(selectProductsError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchProductByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { title, status, moderation, creation, category } = productToCRUD || {};
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
        icon: Category,
        label: 'Категорія',
        value: category?.title || '*Немає даних*',
        isLink: Boolean(category),
        linkTo: category ? `/categories/${category?.uuid}` : '',
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
      category,
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
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetails data={data} />
          </Box>
        )
      }
      error={errorMessage}
      title='Деталі товару/послуги...'
      onClose={handleModalClose}
    />
  );
}

export default ProductViewPage;
