import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

import { API_CONFIG } from '@/src/constants';

import { useFetchEstablishmentByUuidQuery } from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow';
import StatusIcon from '@/src/components/StatusIcon';
import ViewDetails from '@/src/components/ViewDetails';

import { stylesViewPageAvatarSize } from '@/src/styles';

function EstablishmentViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: establishmentData,
    isFetching,
    error: fetchError,
  } = useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const { title, description, url, logo, status, moderation, creation } =
    establishmentData ?? {};
  const { moderatorUuid, moderatorFullName } = moderation ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const apiError = fetchError?.data;

  const logoPath = useMemo(() => {
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return logo
      ? `${baseUrl}/images/establishments/${logo}`
      : `${baseUrl}/images/noLogo.png`;
  }, [logo]);

  const renderLogotype = useMemo(
    () => (
      <Avatar
        alt='Логотип закладу'
        src={logoPath}
        sx={stylesViewPageAvatarSize}
        variant='rounded'
      />
    ),
    [logoPath]
  );

  const renderDetailsData = useMemo(
    () => [
      {
        extra: renderLogotype,
        icon: InfoIcon,
        label: 'Назва',
        value: title,
      },
      {
        icon: DescriptionIcon,
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
        icon: PersonIcon,
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
      },
      ...(moderatorFullName
        ? [
            {
              icon: PersonIcon,
              isLink: Boolean(moderatorFullName),
              label: 'Модератор',
              linkTo: moderatorFullName ? `/users/${moderatorUuid}` : '',
              value: moderatorFullName,
            },
          ]
        : []),
      { icon: CalendarTodayIcon, label: 'Створено', value: createdAt },
      { icon: UpdateIcon, label: 'Редаговано', value: updatedAt },
    ],
    [
      renderLogotype,
      title,
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

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Деталі закладу'
      onClose={handleModalClose}
    >
      <ViewDetails data={renderDetailsData} />
    </ModalWindow>
  );
}

export default EstablishmentViewPage;
