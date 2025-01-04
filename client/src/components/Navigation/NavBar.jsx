import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AttachMoney,
  Category,
  DryCleaning,
  Gavel,
  Home,
  ManageAccounts,
  People,
  ShoppingCart,
  SquareFoot,
  Store,
} from '@mui/icons-material';

import { stylesNavBarListItemText, stylesNavBarMenuItems } from '../../styles';

const navItems = [
  { to: '/', icon: Home, label: 'Головна' },
  { to: '/expenses', icon: ShoppingCart, label: 'Витрати' },
  { to: '/establishments', icon: Store, label: 'Заклади' },
  { to: '/products', icon: DryCleaning, label: 'Товари' },
  { to: '/categories', icon: Category, label: 'Категорії' },
  { to: '/currencies', icon: AttachMoney, label: 'Валюти' },
  { to: '/measures', icon: SquareFoot, label: 'Одиниці' },
  { to: '/moderation', icon: Gavel, label: 'Модерація' },
  { to: '/users', icon: People, label: 'Користувачі' },
  { to: '/roles', icon: ManageAccounts, label: 'Ролі' },
];

function NavBar({ onClose }) {
  const handleItemClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderNavItems = (items) => (
    <List>
      {items.map(({ to, icon: IconComponent, label }) => (
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
            <ListItemText sx={stylesNavBarListItemText} primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box
      component='nav'
      aria-label='main menu items'
      sx={stylesNavBarMenuItems}
    >
      {renderNavItems(navItems)}
    </Box>
  );
}

export default NavBar;
