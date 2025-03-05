import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';

import { configs } from '../../constants';
import useAuthUser from '../../hooks/useAuthUser';

import {
  useFetchUserByUuidQuery,
  useResendConfirmEmailMutation,
} from '../../store/services';

import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import {
  stylesUserViewPageEmailButton,
  stylesViewPageAvatarSize,
} from '../../styles';

const { BASE_URL } = configs;

function UserViewPage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();
  const [infoModalData, setInfoModalData] = useState(null);

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const {
    data: user,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, { skip: isAuthenticatedUser });

  const userData = useMemo(
    () => (isAuthenticatedUser ? authenticatedUser : user),
    [isAuthenticatedUser, authenticatedUser, user]
  );

  const { fullName, role, photo, email, emailConfirm, creation } =
    userData ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const [
    resendConfirmEmail,
    { isLoading: isEmailSubmitting, error: submitEmailError },
  ] = useResendConfirmEmailMutation();

  const error = fetchError || submitEmailError;

  const photoPath = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api', '');
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
      const result = await resendConfirmEmail(email);
      if (result?.data) {
        setInfoModalData({
          severity: result.data?.severity,
          title: result.data?.title,
          message: result.data?.message,
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

  const content = isFetching ? <Preloader /> : <ViewDetails data={data} />;

  if (error) {
    return (
      <InfoModal
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return infoModalData ? (
    <InfoModal
      message={infoModalData.message}
      severity={infoModalData.severity}
      title={infoModalData.title}
      onClose={handleModalClose}
    />
  ) : (
    <ModalWindow
      isOpen
      content={content}
      title='Деталі користувача'
      onClose={handleModalClose}
    />
  );
}

export default UserViewPage;
