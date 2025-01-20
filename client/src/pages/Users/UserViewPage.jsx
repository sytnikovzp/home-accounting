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
  selectCurrentUser,
  selectUsersError,
  selectUsersIsLoading,
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

  const userToCRUD = useSelector((state) => selectCurrentUser(state, uuid));
  const isLoading = useSelector(selectUsersIsLoading);
  const errorMessage = useSelector(selectUsersError);
  const emailVerificationLoading = useSelector(
    selectEmailVerificationIsLoading
  );

  useEffect(() => {
    if (uuid) {
      dispatch(fetchUserByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { fullName, role, photo, email, emailVerificationStatus, creation } =
    userToCRUD || {};
  const { createdAt, updatedAt } = creation || {};

  const handleResendVerification = useCallback(
    async (email) => {
      try {
        const response = await dispatch(sendVerificationEmail(email));
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
      } catch (error) {
        console.error('Error sending verification email:', error.message);
      }
    },
    [dispatch, navigate]
  );

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
                    onClick={() => handleResendVerification(email)}
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
      createdAt,
      updatedAt,
      handleResendVerification,
      emailVerificationLoading,
    ]
  );

  return (
    <ModalWindow
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetails data={data} />
          </Box>
        )
      }
      error={errorMessage}
      title='Деталі користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserViewPage;
