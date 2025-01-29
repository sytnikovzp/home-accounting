import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Button, Tooltip } from '@mui/material';
import {
  AlternateEmail,
  AssignmentInd,
  CalendarToday,
  Info,
  Update,
} from '@mui/icons-material';

import { configs } from '../../constants';

import { selectEmailVerificationIsLoading } from '../../store/selectors/emailVerificationSelectors';
import {
  selectSelectedUser,
  selectUsersActionError,
  selectUsersProcessingAction,
} from '../../store/selectors/usersSelectors';
import { sendVerificationEmail } from '../../store/thunks/emailVerificationThunks';
import { fetchUserByUuid } from '../../store/thunks/usersThunks';

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

function UserViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectSelectedUser);
  const isLoading = useSelector(selectUsersProcessingAction);
  const error = useSelector(selectUsersActionError);
  const emailVerificationLoading = useSelector(
    selectEmailVerificationIsLoading
  );

  useEffect(() => {
    if (uuid) {
      dispatch(fetchUserByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { fullName, role, photo, email, emailVerificationStatus, creation } =
    user ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const handleResendVerification = useCallback(
    (email) => {
      const response = dispatch(sendVerificationEmail(email));
      if (sendVerificationEmail.fulfilled.match(response)) {
        const { severity, title, message } = response.payload;
        navigate(
          `/notification?severity=${encodeURIComponent(
            severity
          )}&title=${encodeURIComponent(
            title
          )}&message=${encodeURIComponent(message)}`
        );
      }
    },
    [dispatch, navigate]
  );

  const handleResendClick = useCallback(() => {
    handleResendVerification(email);
  }, [email, handleResendVerification]);

  const photoSrc = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api/', '');
    if (photo) {
      return `${baseUrl}/images/users/${photo}`;
    }
    return null;
  }, [photo]);

  const data = useMemo(
    () => [
      {
        icon: Info,
        label: 'Повне ім’я',
        value: fullName,
        extra: (
          <Avatar
            alt='Фото користувача'
            src={photoSrc}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ),
      },
      {
        icon: AssignmentInd,
        label: 'Роль',
        value: role?.title || '*Немає даних*',
        isLink: Boolean(role),
        linkTo: role ? `/roles/${role?.uuid}` : '',
      },
      ...(email
        ? [
            {
              icon: AlternateEmail,
              label: 'Email',
              value: email,
              isLink: true,
              linkTo: `mailto:${email}`,
            },
          ]
        : []),
      ...(emailVerificationStatus
        ? [
            {
              icon: () => <StatusIcon status={emailVerificationStatus} />,
              label: 'Обліковий запис',
              value: emailVerificationStatus,
              extra: emailVerificationStatus === 'Очікує веріфікації' && (
                <Tooltip title='Повторно відправити email'>
                  <Button
                    disabled={emailVerificationLoading}
                    size='small'
                    sx={stylesUserViewPageEmailButton}
                    variant='text'
                    onClick={handleResendClick}
                  >
                    ⟳
                  </Button>
                </Tooltip>
              ),
            },
          ]
        : []),
      {
        icon: CalendarToday,
        label: 'Зареєстровано',
        value: createdAt,
      },
      {
        icon: Update,
        label: 'Редаговано',
        value: updatedAt,
      },
    ],
    [
      fullName,
      photoSrc,
      role,
      email,
      emailVerificationStatus,
      emailVerificationLoading,
      handleResendClick,
      createdAt,
      updatedAt,
    ]
  );

  return (
    <ModalWindow
      isOpen
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
      title='Деталі користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserViewPage;
