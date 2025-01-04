import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  CalendarToday,
  Description,
  Info,
  Lock,
  Update,
} from '@mui/icons-material';

import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import {
  stylesRoleViewPageBoxPermission,
  stylesRoleViewPageBoxPermissionEmpty,
  stylesViewPageBox,
} from '../../styles';

function RoleViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: roleToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Role');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const {
    title,
    description,
    permissions = [],
    createdAt,
    updatedAt,
  } = roleToCRUD || {};

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі ролі...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <>
            <Box sx={stylesViewPageBox}>
              <ViewDetailRow icon={Info} label='Назва' value={title} />
              <ViewDetailRow
                icon={Description}
                label='Опис'
                value={description}
              />
              <ViewDetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
              <ViewDetailRow
                icon={Update}
                label='Редаговано'
                value={updatedAt}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Дозволи (Permissions):
              </Typography>
              <Box sx={stylesRoleViewPageBoxPermission}>
                <List dense>
                  {permissions.length > 0 ? (
                    permissions.map((permission) => (
                      <ListItem
                        key={permission.uuid}
                        sx={{ ml: 3 }}
                        disableGutters
                      >
                        <ListItemIcon>
                          <Lock color='primary' />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant='body1'>
                              {permission.title}
                            </Typography>
                          }
                          secondary={
                            permission.description || '*Опис відсутній*'
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={stylesRoleViewPageBoxPermissionEmpty}>
                      <Lock color='disabled' sx={{ mr: 1 }} />
                      <Typography>*Дозволи відсутні*</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            </Box>
          </>
        )
      }
      error={errorMessage}
    />
  );
}

export default RoleViewPage;
