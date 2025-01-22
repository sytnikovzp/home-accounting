import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box } from '@mui/material';
import {
  CalendarToday,
  Description,
  Info,
  Link as LinkIcon,
  Person,
  Update,
} from '@mui/icons-material';

import { configs } from '../../constants';

import {
  selectCurrentEstablishment,
  selectEstablishmentsError,
  selectEstablishmentsIsLoading,
} from '../../store/selectors/establishmentsSelectors';
import { fetchEstablishmentByUuid } from '../../store/thunks/establishmentsThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import {
  stylesViewPageAvatarSize,
  stylesViewPageBox,
  stylesViewPageBoxWithAvatar,
} from '../../styles';

const { BASE_URL } = configs;

function EstablishmentViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const establishmentToCRUD = useSelector((state) =>
    selectCurrentEstablishment(state, uuid)
  );
  const isLoading = useSelector(selectEstablishmentsIsLoading);
  const error = useSelector(selectEstablishmentsError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchEstablishmentByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { title, description, url, logo, status, moderation, creation } =
    establishmentToCRUD || {};
  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const logoSrc = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api/', '');
    if (logo) {
      return `${baseUrl}/images/establishments/${logo}`;
    }
    return `${baseUrl}/images/noLogo.png`;
  }, [logo]);

  const data = useMemo(
    () => [
      {
        icon: Info,
        label: 'Назва',
        value: title,
        extra: (
          <Avatar
            alt='Логотип закладу'
            src={logoSrc}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ),
      },
      {
        icon: Description,
        label: 'Опис',
        value: description || '*Немає даних*',
      },
      {
        icon: LinkIcon,
        label: 'Посилання',
        value: url || '*Немає даних*',
        isLink: Boolean(url),
        linkTo: url ? `${url}` : '',
      },
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
      logoSrc,
      description,
      url,
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
            <ViewDetails
              data={data}
              extraStyles={stylesViewPageBoxWithAvatar}
            />
          </Box>
        )
      }
      error={error}
      title='Деталі закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentViewPage;
