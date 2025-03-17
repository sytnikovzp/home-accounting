import { Link as RouterLink } from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function NavItem({ to, icon: IconComponent, label, onClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton component={RouterLink} to={to} onClick={onClick}>
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={label} sx={{ color: 'text.primary' }} />
      </ListItemButton>
    </ListItem>
  );
}

export default NavItem;
