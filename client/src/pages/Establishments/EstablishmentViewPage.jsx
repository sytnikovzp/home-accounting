import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
import { useFetchEstablishmentByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageAvatarSize, stylesViewPageBox } from '../../styles';

const { BASE_URL } = configs;

function EstablishmentViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: establishment,
    isFetching,
    error: fetchError,
  } = useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const { title, description, url, logo, status, moderation, creation } =
    establishment ?? {};
  const { moderatorUuid, moderatorFullName } = moderation ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const logoPath = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api', '');
    return logo
      ? `${baseUrl}/images/establishments/${logo}`
      : `${baseUrl}/images/noLogo.png`;
  }, [logo]);

  const data = useMemo(
    () => [
      {
        extra: (
          <Avatar
            alt='Логотип закладу'
            src={logoPath}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ),
        icon: Info,
        label: 'Назва',
        value: title,
      },
      {
        icon: Description,
        label: 'Опис',
        value: description || '*Немає даних*',
      },
      {
        icon: LinkIcon,
        isLink: Boolean(url),
        label: 'Посилання',
        linkTo: url ? `${url}` : '',
        value: url || '*Немає даних*',
      },
      {
        icon: () => <StatusIcon status={status} />,
        label: 'Статус',
        value: status,
      },
      {
        icon: Person,
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
      },
      ...(moderatorFullName
        ? [
            {
              icon: Person,
              isLink: Boolean(moderatorFullName),
              label: 'Модератор',
              linkTo: moderatorFullName ? `/users/${moderatorUuid}` : '',
              value: moderatorFullName,
            },
          ]
        : []),
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [
      title,
      logoPath,
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

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Box sx={stylesViewPageBox}>
        <ViewDetails data={data} />
      </Box>
    );
  }, [data, isFetching]);

  return (
    <ModalWindow
      isOpen
      content={content}
      error={fetchError?.data}
      title='Деталі закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentViewPage;
