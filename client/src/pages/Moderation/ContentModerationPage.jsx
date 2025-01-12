import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Link } from '@mui/material';
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

import { BASE_URL } from '../../constants';
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import {
  stylesViewPageAvatarSize,
  stylesViewPageBox,
  stylesViewPageBoxWithAvatar,
} from '../../styles';

function ContentModerationPage({
  handleModalClose,
  fetchModerations,
  crudError,
  setCrudError,
}) {
  const { path, uuid } = useParams();
  const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);
  const navigate = useNavigate();

  const {
    entity: moderationToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity(capitalizedPath);

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, path, fetchEntityByUuid]);

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

  const logoSrc = logo
    ? `${BASE_URL.replace('/api/', '')}/images/establishments/${logo}`
    : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;

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

  const handleApprove = async () => {
    setCrudError(null);
    const status = 'approved';
    try {
      await moderationMethod(uuid, status);
      handleModalClose();
      fetchModerations();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleEditAndApprove = () => {
    handleModalClose();
    navigate(`/${newPath}/edit/${uuid}`);
  };

  const handleReject = async () => {
    setCrudError(null);
    const status = 'rejected';
    try {
      await moderationMethod(uuid, status);
      handleModalClose();
      fetchModerations();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      showCloseButton
      actions={[
        <Button
          key='approve'
          fullWidth
          color='success'
          size='large'
          variant='contained'
          onClick={handleApprove}
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
          onClick={handleReject}
        >
          Відхилити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <Box sx={stylesViewPageBoxWithAvatar}>
              <ViewDetailRow icon={Info} label='Назва' value={title} />
              {logo && (
                <Avatar
                  alt='Логотип'
                  src={logoSrc}
                  sx={stylesViewPageAvatarSize}
                  variant='rounded'
                />
              )}
            </Box>
            <ViewDetailRow
              icon={ContentPasteSearch}
              label='Тип контенту'
              value={contentType}
            />
            {description && (
              <ViewDetailRow
                icon={Description}
                label='Опис'
                value={description}
              />
            )}
            {url && (
              <ViewDetailRow
                icon={LinkIcon}
                label='Посилання'
                value={
                  <Link href={url} rel='noopener noreferrer' target='_blank'>
                    {url}
                  </Link>
                }
              />
            )}
            {category && (
              <ViewDetailRow
                icon={Category}
                label='Категорія'
                value={
                  <Link
                    color='primary'
                    component={RouterLink}
                    to={`/categories/${category.uuid}`}
                    underline='hover'
                  >
                    {category.title}
                  </Link>
                }
              />
            )}
            <ViewDetailRow
              icon={() => <StatusIcon status={status} />}
              label='Статус'
              value={status}
            />
            <ViewDetailRow
              icon={Person}
              label='Автор'
              value={
                creatorFullName ? (
                  <Link
                    color='primary'
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                ) : (
                  '*Немає даних*'
                )
              }
            />
            <ViewDetailRow
              icon={CalendarToday}
              label='Створено'
              value={createdAt}
            />
            <ViewDetailRow icon={Update} label='Редаговано' value={updatedAt} />
          </Box>
        )
      }
      error={errorMessage || crudError}
      title='Модерація контенту...'
      onClose={handleModalClose}
    />
  );
}

export default ContentModerationPage;
