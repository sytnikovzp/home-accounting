import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

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
    isFetching,
    error: fetchError,
  } = fetchEntityQuery(uuid, { skip: !uuid });

  const [
    moderateProduct,
    { isLoading: isProductSubmitting, error: submitProductError },
  ] = useModerationProductMutation();
  const [
    moderateCategory,
    { isLoading: isCategorySubmitting, error: submitCategoryError },
  ] = useModerationCategoryMutation();
  const [
    moderateEstablishment,
    { isLoading: isEstablishmentSubmitting, error: submitEstablishmentError },
  ] = useModerationEstablishmentMutation();

  const moderateEntity = {
    product: moderateProduct,
    category: moderateCategory,
    establishment: moderateEstablishment,
  }[path];

  const isSubmiting = {
    product: isProductSubmitting,
    category: isCategorySubmitting,
    establishment: isEstablishmentSubmitting,
  }[path];

  const submitError = {
    product: submitProductError,
    category: submitCategoryError,
    establishment: submitEstablishmentError,
  }[path];

  const pathMapping = useMemo(
    () => ({
      category: 'categories',
      product: 'products',
      establishment: 'establishments',
    }),
    []
  );

  const handleModerationAction = useCallback(
    async (status) => {
      if (!moderateEntity) {
        return;
      }
      await moderateEntity({ [`${path}Uuid`]: uuid, status });
    },
    [moderateEntity, path, uuid]
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
        icon: InfoIcon,
        label: 'Назва',
        value: title,
      },
      {
        icon: ContentPasteSearchIcon,
        label: 'Тип контенту',
        value: contentType || '*Немає даних*',
      },
      ...(description
        ? [
            {
              icon: DescriptionIcon,
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
              icon: CategoryIcon,
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
        icon: PersonIcon,
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
      },
      { icon: CalendarTodayIcon, label: 'Створено', value: createdAt },
      { icon: UpdateIcon, label: 'Редаговано', value: updatedAt },
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
        disabled={isFetching || isSubmiting}
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
        disabled={isFetching || isSubmiting}
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
        disabled={isFetching || isSubmiting}
        size='large'
        variant='contained'
        onClick={() => handleModerationAction('rejected')}
      >
        Відхилити
      </Button>,
    ],
    [handleEditAndApprove, handleModerationAction, isFetching, isSubmiting]
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
      error={fetchError?.data || submitError?.data}
      title='Модерація контенту...'
      onClose={handleModalClose}
    />
  );
}

export default ContentModerationPage;
