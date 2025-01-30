import { useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { Lock } from '@mui/icons-material';

import {
  stylesPermissionsListBox,
  stylesPermissionsListBoxEmpty,
} from '../../styles';

function PermissionsList({ permissions = [] }) {
  const renderEmptyState = () => (
    <Box sx={stylesPermissionsListBoxEmpty}>
      <Lock color='disabled' sx={{ mr: 12 }} />
      <Typography>*Дозволи відсутні*</Typography>
    </Box>
  );

  const renderedPermissions = useMemo(() => {
    if (permissions.length === 0) {
      return null;
    }

    return (
      <List dense>
        {permissions.map(({ uuid, title, description }) => (
          <ListItem key={uuid} disableGutters>
            <ListItemIcon>
              <Lock color='primary' />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant='body1'>{title}</Typography>}
              secondary={description || '*Немає даних*'}
            />
          </ListItem>
        ))}
      </List>
    );
  }, [permissions]);

  return (
    <Box sx={stylesPermissionsListBox}>
      {renderedPermissions || renderEmptyState()}
    </Box>
  );
}

export default PermissionsList;
