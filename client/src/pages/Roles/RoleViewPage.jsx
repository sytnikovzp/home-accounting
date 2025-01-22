import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Typography } from '@mui/material';
import { CalendarToday, Description, Info, Update } from '@mui/icons-material';

import {
  selectCurrentRole,
  selectRolesError,
  selectRolesIsLoading,
} from '../../store/selectors/rolesSelectors';
import { fetchRoleByUuid } from '../../store/thunks/rolesThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import PermissionsList from '../../components/ViewDetails/PermissionsList';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function RoleViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const roleToCRUD = useSelector((state) => selectCurrentRole(state, uuid));
  const isLoading = useSelector(selectRolesIsLoading);
  const error = useSelector(selectRolesError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchRoleByUuid(uuid));
    }
  }, [dispatch, uuid]);

  const { title, description, permissions, createdAt, updatedAt } =
    roleToCRUD || {};

  const data = useMemo(
    () => [
      { icon: Info, label: 'Назва', value: title },
      { icon: Description, label: 'Опис', value: description },
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [title, description, createdAt, updatedAt]
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
            <Divider />
            <Typography variant='body1'>Дозволи (Permissions):</Typography>
            <PermissionsList permissions={permissions} />
          </Box>
        )
      }
      error={error}
      title='Деталі ролі...'
      onClose={handleModalClose}
    />
  );
}

export default RoleViewPage;
