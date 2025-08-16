import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';

import { API_CONFIG } from '@/src/constants';
import useAuthentication from '@/src/hooks/useAuthentication';

import {
  useFetchUserByUuidQuery,
  useResendConfirmEmailMutation,
} from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow/ModalWindow';
import StatusIcon from '@/src/components/StatusIcon/StatusIcon';
import ViewDetails from '@/src/components/ViewDetails/ViewDetails';

import {
  stylesUserViewPageEmailButton,
  stylesViewPageAvatarSize,
} from '@/src/styles';

function UserViewPage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthentication();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const {
    data: userData,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, { skip: isAuthenticatedUser });

  const user = isAuthenticatedUser ? authenticatedUser : userData;

  const { fullName, role, photo, email, emailConfirm, creation } = user ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const [
    resendConfirmEmail,
    { isLoading: isEmailSubmitting, error: submitEmailError },
  ] = useResendConfirmEmailMutation();

  const apiError = fetchError?.data || submitEmailError?.data;

  const photoPath = useMemo(() => {
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return photo ? `${baseUrl}/images/users/${photo}` : null;
  }, [photo]);

  const handleModalClose = useCallback(() => {
    if (uuid) {
      navigate('/users');
    } else {
      navigate(-1);
    }
  }, [uuid, navigate]);

  const handleResendClick = useCallback(async () => {
    if (email) {
      const response = await resendConfirmEmail(email);
      if (response?.data) {
        setResponseData({
          severity: response.data?.severity,
          title: response.data?.title,
          message: response.data?.message,
        });
      }
    }
  }, [email, resendConfirmEmail]);

  const showResendButton = !uuid && emailConfirm === 'Очікує підтвердження';

  const resendButton = useMemo(() => {
    if (!showResendButton) {
      return null;
    }
    return (
      <Tooltip title='Повторно відправити email'>
        <Button
          disabled={isEmailSubmitting}
          size='small'
          sx={stylesUserViewPageEmailButton}
          variant='text'
          onClick={handleResendClick}
        >
          ⟳
        </Button>
      </Tooltip>
    );
  }, [showResendButton, isEmailSubmitting, handleResendClick]);

  const renderAvatar = useMemo(
    () => (
      <Avatar
        alt='Фото користувача'
        src={photoPath}
        sx={stylesViewPageAvatarSize}
        variant='rounded'
      />
    ),
    [photoPath]
  );

  const renderDetailsData = useMemo(
    () => [
      {
        extra: renderAvatar,
        icon: InfoIcon,
        label: 'Повне ім’я',
        value: fullName,
      },
      {
        icon: AssignmentIndIcon,
        isLink: Boolean(role),
        label: 'Роль',
        linkTo: role ? `/roles/${role?.uuid}` : '',
        value: role?.title || '*Немає даних*',
      },
      ...(email
        ? [
            {
              icon: AlternateEmailIcon,
              isLink: true,
              label: 'Email',
              linkTo: `mailto:${email}`,
              value: email,
            },
          ]
        : []),
      ...(emailConfirm
        ? [
            {
              extra: resendButton,
              icon: () => <StatusIcon status={emailConfirm} />,
              label: 'Обліковий запис',
              value: emailConfirm,
            },
          ]
        : []),
      {
        icon: CalendarTodayIcon,
        label: 'Зареєстровано',
        value: createdAt,
      },
      {
        icon: UpdateIcon,
        label: 'Редаговано',
        value: updatedAt,
      },
    ],
    [
      renderAvatar,
      fullName,
      role,
      email,
      emailConfirm,
      resendButton,
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

  return responseData ? (
    <ModalWindow
      isOpen
      showCloseButton
      title={responseData.title}
      onClose={handleModalClose}
    >
      <Alert severity={responseData.severity}>{responseData.message}</Alert>
    </ModalWindow>
  ) : (
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Деталі користувача'
      onClose={handleModalClose}
    >
      <ViewDetails data={renderDetailsData} />
    </ModalWindow>
  );
}

export default UserViewPage;
