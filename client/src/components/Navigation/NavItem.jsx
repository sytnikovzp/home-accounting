import { Link as RouterLink } from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { stylesNavItemText } from '@/src/styles';

function NavItem({ icon: IconComponent, label, to, onClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton component={RouterLink} to={to} onClick={onClick}>
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={label} sx={stylesNavItemText} />
      </ListItemButton>
    </ListItem>
  );
}

export default NavItem;
