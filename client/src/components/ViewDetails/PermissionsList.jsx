import { useMemo } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import LockIcon from '@mui/icons-material/Lock';

import {
  stylesPermissionsListBox,
  stylesPermissionsListBoxEmpty,
} from '../../styles';

function PermissionsList({ permissions = [] }) {
  const renderEmptyState = () => (
    <Box sx={stylesPermissionsListBoxEmpty}>
      <LockIcon color='disabled' sx={{ mr: 12 }} />
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
              <LockIcon color='primary' />
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
