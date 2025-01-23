import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import {
  CalendarToday,
  Description,
  Info,
  Person,
  Update,
} from '@mui/icons-material';

import {
  selectCurrenciesActionError,
  selectCurrenciesProcessingAction,
  selectSelectedCurrency,
} from '../../store/selectors/currenciesSelectors';
import { fetchCurrencyByUuid } from '../../store/thunks/currenciesThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function CurrencyViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const currency = useSelector(selectSelectedCurrency);
  const isLoading = useSelector(selectCurrenciesProcessingAction);
  const error = useSelector(selectCurrenciesActionError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchCurrencyByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { title, code, creation } = currency || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const data = useMemo(
    () => [
      { icon: Info, label: 'Назва', value: title },
      { icon: Description, label: 'Міжнародний код валюти', value: code },
      {
        icon: Person,
        label: 'Автор',
        value: creatorFullName,
        isLink: Boolean(creatorFullName),
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
      },
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [title, code, creatorFullName, creatorUuid, createdAt, updatedAt]
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
      title='Деталі валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyViewPage;
