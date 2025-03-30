import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';

import { API_CONFIG } from '../../constants';
import useAuthUser from '../../hooks/useAuthUser';

import {
  useFetchUserByUuidQuery,
  useResendConfirmEmailMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import {
  stylesUserViewPageEmailButton,
  stylesViewPageAvatarSize,
} from '../../styles';

function UserViewPage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const {
    data: user,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, { skip: isAuthenticatedUser });

  const userData = isAuthenticatedUser ? authenticatedUser : user;

  const { fullName, role, photo, email, emailConfirm, creation } =
    userData ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const [
    resendConfirmEmail,
    { isLoading: isEmailSubmitting, error: submitEmailError },
  ] = useResendConfirmEmailMutation();

  const error = fetchError?.data || submitEmailError?.data;

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

  const avatar = useMemo(
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

  const data = useMemo(
    () => [
      {
        extra: avatar,
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
      avatar,
      fullName,
      role,
      email,
      emailConfirm,
      resendButton,
      createdAt,
      updatedAt,
    ]
  );

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return responseData ? (
    <ModalWindow isOpen title={responseData.title} onClose={handleModalClose}>
      <Alert severity={responseData.severity}>{responseData.message}</Alert>
      <Box display='flex' justifyContent='center' mt={2}>
        <Button
          fullWidth
          color='success'
          variant='contained'
          onClick={handleModalClose}
        >
          Закрити
        </Button>
      </Box>
    </ModalWindow>
  ) : (
    <ModalWindow isOpen title='Деталі користувача' onClose={handleModalClose}>
      {isFetching ? <Preloader /> : <ViewDetails data={data} />}
    </ModalWindow>
  );
}

export default UserViewPage;
