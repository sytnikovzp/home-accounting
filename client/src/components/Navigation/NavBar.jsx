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
  { icon: Home, label: 'Головна', to: '/' },
  { icon: ShoppingCart, label: 'Витрати', to: '/expenses' },
  { icon: Store, label: 'Заклади', to: '/establishments' },
  { icon: DryCleaning, label: 'Товари', to: '/products' },
  { icon: Category, label: 'Категорії', to: '/categories' },
  { icon: AttachMoney, label: 'Валюти', to: '/currencies' },
  { icon: SquareFoot, label: 'Одиниці', to: '/measures' },
  { icon: Gavel, label: 'Модерація', to: '/moderation' },
  { icon: People, label: 'Користувачі', to: '/users' },
  { icon: ManageAccounts, label: 'Ролі', to: '/roles' },
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
