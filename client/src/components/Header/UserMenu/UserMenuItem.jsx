import { useCallback } from 'react';

import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';

function UserMenuItem({ label, icon, action, isLogout, onAction }) {
  const handleClick = useCallback(() => {
    onAction(action, isLogout);
  }, [action, isLogout, onAction]);

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {label}
    </MenuItem>
  );
}

export default UserMenuItem;
