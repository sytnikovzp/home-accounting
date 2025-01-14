import { useCallback } from 'react';
import { ListItemIcon, MenuItem } from '@mui/material';

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
