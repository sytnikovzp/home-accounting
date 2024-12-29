import { Link as RouterLink } from 'react-router-dom';
// ==============================================================
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
// ==============================================================
import { stylesListItemText, stylesNavMenuItems } from '../../styles/theme';

const navItems = [
  { to: '/', icon: 'Home', label: 'Головна' },
  { to: '/purchases', icon: 'ShoppingCart', label: 'Покупки' },
  { to: '/shops', icon: 'Store', label: 'Заклади' },
  { to: '/products', icon: 'DryCleaning', label: 'Товари' },
  { to: '/categories', icon: 'Category', label: 'Категорії' },
  { to: '/currencies', icon: 'AttachMoney', label: 'Валюти' },
  { to: '/measures', icon: 'SquareFoot', label: 'Одиниці' },
  { to: '/moderation', icon: 'Gavel', label: 'Модерація' },
  { to: '/users', icon: 'People', label: 'Користувачі' },
  { to: '/roles', icon: 'ManageAccounts', label: 'Ролі' },
];

function NavBar({ onClose }) {
  const handleItemClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderNavItems = (items) => (
    <List>
      {items.map(({ to, icon, label }) => {
        const IconComponent = Icons[icon];
        return (
          <ListItem
            disablePadding
            key={label}
            component={RouterLink}
            to={to}
            onClick={handleItemClick}
          >
            <ListItemButton>
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText sx={stylesListItemText} primary={label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Box component='nav' aria-label='main menu items' sx={stylesNavMenuItems}>
      {renderNavItems(navItems)}
    </Box>
  );
}

export default NavBar;
