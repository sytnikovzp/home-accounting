import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
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
  stylesViewPageBox,
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

  const data = useMemo(
    () => [
      {
        extra: (
          <Avatar
            alt='Фото користувача'
            src={photoPath}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ),
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
              extra: emailConfirm === 'Очікує підтвердження' && (
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
              ),
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
      fullName,
      photoPath,
      role,
      email,
      emailConfirm,
      isEmailSubmitting,
      handleResendClick,
      createdAt,
      updatedAt,
    ]
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

  return infoModalData ? (
    <InfoModal
      isOpen
      message={infoModalData.message}
      severity={infoModalData.severity}
      title={infoModalData.title}
      onClose={handleModalClose}
    />
  ) : (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Деталі користувача'
      onClose={handleModalClose}
    />
  );
}

export default UserViewPage;
