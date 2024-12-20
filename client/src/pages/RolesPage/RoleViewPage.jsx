import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Info,
  CalendarToday,
  Update,
  Description,
  Lock,
} from '@mui/icons-material';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

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
    uuid: roleUuid,
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
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DetailRow icon={Info} label='UUID' value={roleUuid} />
              <DetailRow icon={Info} label='Назва' value={title} />
              <DetailRow icon={Description} label='Опис' value={description} />
              <DetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
              <DetailRow icon={Update} label='Редаговано' value={updatedAt} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Дозволи (Permissions):
              </Typography>
              <Box
                sx={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              >
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        color: 'grey.600',
                      }}
                    >
                      <Lock color='disabled' sx={{ mr: 1 }} />
                      <Typography>*Дозволи відсутні*</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            </Box>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default RoleViewPage;
