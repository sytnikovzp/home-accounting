import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button } from '@mui/material';
import {
  CalendarToday,
  Category,
  ContentPasteSearch,
  Description,
  Info,
  Link as LinkIcon,
  Person,
  Update,
} from '@mui/icons-material';

import { configs } from '../../constants';
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageAvatarSize, stylesViewPageBox } from '../../styles';

const { BASE_URL } = configs;

function ContentModerationPage({ handleModalClose, fetchModerations }) {
  const { path, uuid } = useParams();
  const navigate = useNavigate();
  const capitalizedPath = useMemo(
    () => path.charAt(0).toUpperCase() + path.slice(1),
    [path]
  );

  const {
    entity: moderationToCRUD,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity(capitalizedPath);

  useEffect(() => {
    if (uuid && !moderationToCRUD) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid, moderationToCRUD]);

  const {
    contentType,
    title,
    description,
    url,
    logo,
    status,
    creation,
    category,
  } = moderationToCRUD || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const logoSrc = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api/', '');
    if (logo) {
      return `${baseUrl}/images/establishments/${logo}`;
    }
    return `${baseUrl}/images/noLogo.png`;
  }, [logo]);

  const pluralizePath = (path) => {
    switch (path) {
      case 'product':
        return 'products';
      case 'category':
        return 'categories';
      case 'establishment':
        return 'establishments';
      default:
        return path;
    }
  };

  const newPath = pluralizePath(path);

  const selectMethod = (path) => {
    switch (path) {
      case 'product':
        return restController.moderationProduct;
      case 'category':
        return restController.moderationCategory;
      case 'establishment':
        return restController.moderationEstablishment;
      default:
        return path;
    }
  };
  const moderationMethod = selectMethod(path);

  const handleModerationAction = async (status) => {
    await moderationMethod(uuid, status);
    handleModalClose();
    fetchModerations();
  };

  const handleEditAndApprove = () => {
    handleModalClose();
    navigate(`/${newPath}/edit/${uuid}`);
  };

  const data = useMemo(
    () => [
      {
        icon: Info,
        label: 'Назва',
        value: title,
        extra: logo ? (
          <Avatar
            alt='Логотип'
            src={logoSrc}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ) : null,
      },
      {
        icon: ContentPasteSearch,
        label: 'Тип контенту',
        value: contentType,
      },
      ...(description
        ? [
            {
              icon: Description,
              label: 'Опис',
              value: description,
            },
          ]
        : []),
      ...(url
        ? [
            {
              icon: LinkIcon,
              label: 'Посилання',
              value: url || '*Немає даних*',
              isLink: Boolean(url),
              linkTo: url ? `${url}` : '',
            },
          ]
        : []),
      ...(category
        ? [
            {
              icon: Category,
              label: 'Категорія',
              value: category?.title || '*Немає даних*',
              isLink: Boolean(category),
              linkTo: `/categories/${category?.uuid}`,
            },
          ]
        : []),
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
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [
      category,
      contentType,
      createdAt,
      creatorFullName,
      creatorUuid,
      description,
      logo,
      logoSrc,
      status,
      title,
      updatedAt,
      url,
    ]
  );

  return (
    <ModalWindow
      isOpen
      actions={[
        <Button
          key='approve'
          fullWidth
          color='success'
          size='large'
          variant='contained'
          onClick={() => handleModerationAction('approved')}
        >
          Затвердити
        </Button>,
        <Button
          key='edit'
          fullWidth
          color='warning'
          size='large'
          variant='contained'
          onClick={handleEditAndApprove}
        >
          Редагувати та затвердити
        </Button>,
        <Button
          key='reject'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={() => handleModerationAction('rejected')}
        >
          Відхилити
        </Button>,
      ]}
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
      title='Модерація контенту...'
      onClose={handleModalClose}
    />
  );
}

export default ContentModerationPage;
