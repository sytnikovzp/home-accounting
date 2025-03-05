import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import LockOpenIcon from '@mui/icons-material/LockOpen';

import {
  stylesPermissionsListBox,
  stylesPermissionsListBoxEmpty,
} from '../../styles';

function PermissionsList({ permissions = [] }) {
  const renderEmptyState = () => (
    <Box sx={stylesPermissionsListBoxEmpty}>
      <LockOpenIcon color='disabled' fontSize='large' sx={{ mr: 12 }} />
      <Typography>*Права доступу відсутні*</Typography>
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
              <LockOpenIcon color='success' fontSize='large' />
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
    <>
      <Divider />
      <Typography gutterBottom sx={{ mt: 2 }} variant='h6'>
        Права доступу:
      </Typography>
      <Box sx={stylesPermissionsListBox}>
        {renderedPermissions || renderEmptyState()}
      </Box>
    </>
  );
}

export default PermissionsList;
