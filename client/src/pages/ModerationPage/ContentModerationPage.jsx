import { useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Link, Avatar, Button } from '@mui/material';
import {
  Info,
  CalendarToday,
  Person,
  Update,
  Description,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Link as LinkIcon,
  Category,
  ContentPasteSearch,
} from '@mui/icons-material';
// ==============================================================
import { BASE_URL } from '../../constants';
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

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

  const statusIcon = (() => {
    switch (status) {
      case 'Затверджено':
        return <CheckCircle color='success' />;
      case 'Очікує модерації':
        return <HourglassEmpty color='warning' />;
      case 'Відхилено':
        return <Cancel color='error' />;
      default:
        return null;
    }
  })();

  const logoSrc = logo
    ? `${BASE_URL.replace('/api/', '')}/images/shops/${logo}`
    : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;

  const pluralizePath = (path) => {
    switch (path) {
      case 'product':
        return 'products';
      case 'category':
        return 'categories';
      case 'shop':
        return 'shops';
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
      case 'shop':
        return restController.moderationShop;
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
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
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
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
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
          <Box sx={{ mt: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <DetailRow icon={Info} label='Назва' value={title} />
                {logo && (
                  <Avatar
                    src={logoSrc}
                    alt='Логотип'
                    variant='rounded'
                    sx={{ width: 50, height: 50 }}
                  />
                )}
              </Box>
              <DetailRow
                icon={ContentPasteSearch}
                label='Тип контенту'
                value={contentType}
              />
              {description && (
                <DetailRow
                  icon={Description}
                  label='Опис'
                  value={description}
                />
              )}
              {url && (
                <DetailRow
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
                <DetailRow
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
              <DetailRow
                icon={() => statusIcon}
                label='Статус'
                value={status}
              />
              <DetailRow
                icon={Person}
                label='Автор'
                value={
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                }
              />
              <DetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
              <DetailRow icon={Update} label='Редаговано' value={updatedAt} />
            </Box>
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
