import { useCallback } from 'react';
import { Box, List } from '@mui/material';
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

import NavItem from './NavItem';

import { stylesNavBarBox } from '../../styles';

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
  const handleItemClick = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Box aria-label='main menu items' component='nav' sx={stylesNavBarBox}>
      <List>
        {navItems.map(({ to, icon, label }) => (
          <NavItem
            key={label}
            icon={icon}
            label={label}
            to={to}
            onClick={handleItemClick}
          />
        ))}
      </List>
    </Box>
  );
}

export default NavBar;
