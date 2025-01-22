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
  selectCurrentMeasure,
  selectMeasuresError,
  selectMeasuresIsLoading,
} from '../../store/selectors/measuresSelectors';
import { fetchMeasureByUuid } from '../../store/thunks/measuresThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function MeasureViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const measureToCRUD = useSelector((state) =>
    selectCurrentMeasure(state, uuid)
  );
  const isLoading = useSelector(selectMeasuresIsLoading);
  const error = useSelector(selectMeasuresError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchMeasureByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { title, description, creation } = measureToCRUD || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const data = useMemo(
    () => [
      { icon: Info, label: 'Назва', value: title },
      {
        icon: Description,
        label: 'Опис',
        value: description || '*Немає даних*',
      },
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
    [title, description, creatorFullName, creatorUuid, createdAt, updatedAt]
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
      error={error}
      title='Деталі одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureViewPage;
