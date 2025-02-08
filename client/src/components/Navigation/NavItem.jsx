import { Link as RouterLink } from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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
