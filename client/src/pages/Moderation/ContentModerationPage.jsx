import { useCallback, useMemo } from 'react';
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
import {
  useFetchCategoryByUuidQuery,
  useFetchEstablishmentByUuidQuery,
  useFetchProductByUuidQuery,
  useModerationCategoryMutation,
  useModerationEstablishmentMutation,
  useModerationProductMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageAvatarSize, stylesViewPageBox } from '../../styles';

const { BASE_URL } = configs;

function ContentModerationPage({ handleModalClose }) {
  const { path, uuid } = useParams();
  const navigate = useNavigate();

  const fetchEntityQuery = {
    product: useFetchProductByUuidQuery,
    category: useFetchCategoryByUuidQuery,
    establishment: useFetchEstablishmentByUuidQuery,
  }[path];

  const {
    data: moderation,
    isLoading: isFetching,
    error: fetchError,
  } = fetchEntityQuery(uuid, { skip: !uuid });

  const [
    moderateProduct,
    { isLoading: isProductModerating, error: productError },
  ] = useModerationProductMutation();
  const [
    moderateCategory,
    { isLoading: isCategoryModerating, error: categoryError },
  ] = useModerationCategoryMutation();
  const [
    moderateEstablishment,
    { isLoading: isEstablishmentModerating, error: establishmentError },
  ] = useModerationEstablishmentMutation();

  const moderateEntity = {
    product: moderateProduct,
    category: moderateCategory,
    establishment: moderateEstablishment,
  }[path];

  const isModerating = {
    product: isProductModerating,
    category: isCategoryModerating,
    establishment: isEstablishmentModerating,
  }[path];

  const moderationError = {
    product: productError,
    category: categoryError,
    establishment: establishmentError,
  }[path];

  const handleModerationAction = useCallback(
    async (status) => {
      if (!moderateEntity) {
        return;
      }
      await moderateEntity({ [`${path}Uuid`]: uuid, status });
    },
    [moderateEntity, path, uuid]
  );

  const pathMapping = useMemo(
    () => ({
      category: 'categories',
      product: 'products',
      establishment: 'establishments',
    }),
    []
  );

  const handleEditAndApprove = useCallback(() => {
    navigate(`/${pathMapping[path] || path}/edit/${uuid}`);
  }, [pathMapping, path, navigate, uuid]);

  const {
    contentType,
    title,
    description,
    url,
    logo,
    status,
    creation,
    category,
  } = moderation ?? {};
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
        extra: logo ? (
          <Avatar
            alt='Логотип закладу'
            src={logoPath}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ) : null,
        icon: Info,
        label: 'Назва',
        value: title,
      },
      {
        icon: ContentPasteSearch,
        label: 'Тип контенту',
        value: contentType || '*Немає даних*',
      },
      ...(description
        ? [
            {
              icon: Description,
              label: 'Опис',
              value: description || '*Немає даних*',
            },
          ]
        : []),
      ...(url
        ? [
            {
              icon: LinkIcon,
              isLink: Boolean(url),
              label: 'Посилання',
              linkTo: url ? `${url}` : '',
              value: url || '*Немає даних*',
            },
          ]
        : []),
      ...(category
        ? [
            {
              icon: Category,
              isLink: Boolean(category?.title),
              label: 'Категорія',
              linkTo: category ? `/categories/${category?.uuid}` : '',
              value: category?.title || '*Немає даних*',
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
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
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
      logoPath,
      status,
      title,
      updatedAt,
      url,
    ]
  );

  const actions = useMemo(
    () => [
      <Button
        key='approve'
        fullWidth
        color='success'
        disabled={isFetching || isModerating}
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
        disabled={isFetching || isModerating}
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
        disabled={isFetching || isModerating}
        size='large'
        variant='contained'
        onClick={() => handleModerationAction('rejected')}
      >
        Відхилити
      </Button>,
    ],
    [handleEditAndApprove, handleModerationAction, isFetching, isModerating]
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
      actions={actions}
      content={content}
      error={fetchError?.data || moderationError?.data}
      title='Модерація контенту...'
      onClose={handleModalClose}
    />
  );
}

export default ContentModerationPage;
