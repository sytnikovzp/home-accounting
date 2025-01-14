import { Link as RouterLink } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { stylesNavItemText } from '../../styles';

function NavItem({ to, icon: IconComponent, label, onClick }) {
  return (
    <ListItem disablePadding component={RouterLink} to={to} onClick={onClick}>
      <ListItemButton>
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={label} sx={stylesNavItemText} />
      </ListItemButton>
    </ListItem>
  );
}

export default NavItem;
