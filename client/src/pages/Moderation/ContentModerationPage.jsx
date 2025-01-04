import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Link } from '@mui/material';
import {
  CalendarToday,
  Cancel,
  Category,
  CheckCircle,
  ContentPasteSearch,
  Description,
  HourglassEmpty,
  Info,
  Link as LinkIcon,
  Person,
  Update,
} from '@mui/icons-material';

import { BASE_URL } from '../../constants';
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import {
  stylesViewPageAvatarSize,
  stylesViewPageBox,
  stylesViewPageBoxWithAvatar,
} from '../../styles';

const getStatusIcon = (status) => {
  const icons = {
    Затверджено: <CheckCircle color='success' />,
    'Очікує модерації': <HourglassEmpty color='warning' />,
  };
  return icons[status] || <Cancel color='error' />;
};

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
    if (uuid) fetchEntityByUuid(uuid);
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
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Модерація контенту...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <Box sx={stylesViewPageBoxWithAvatar}>
              <ViewDetailRow icon={Info} label='Назва' value={title} />
              {logo && (
                <Avatar
                  src={logoSrc}
                  alt='Логотип'
                  variant='rounded'
                  sx={stylesViewPageAvatarSize}
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
                  <Link href={url} target='_blank' rel='noopener noreferrer'>
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
                    component={RouterLink}
                    to={`/categories/${category.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {category.title}
                  </Link>
                }
              />
            )}
            <ViewDetailRow
              icon={() => getStatusIcon(status)}
              label='Статус'
              value={status}
            />
            <ViewDetailRow
              icon={Person}
              label='Автор'
              value={
                creatorFullName ? (
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                ) : (
                  '*Дані відсутні*'
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
      actions={[
        <Button
          key='approve'
          variant='contained'
          color='success'
          size='large'
          onClick={handleApprove}
          fullWidth
        >
          Затвердити
        </Button>,
        <Button
          key='edit'
          variant='contained'
          color='warning'
          size='large'
          onClick={handleEditAndApprove}
          fullWidth
        >
          Редагувати та затвердити
        </Button>,
        <Button
          key='reject'
          variant='contained'
          color='error'
          size='large'
          onClick={handleReject}
          fullWidth
        >
          Відхилити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default ContentModerationPage;
