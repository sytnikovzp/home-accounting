import { Link } from 'react-router-dom';
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
import { navItemTextStyle } from '../../services/styleService';

const navItems = [
  { to: '/', icon: 'Home', label: 'Головна' },
  { to: '/purchases', icon: 'ShoppingCart', label: 'Покупки' },
  { to: '/shops', icon: 'Store', label: 'Магазини' },
  { to: '/products', icon: 'Storefront', label: 'Продукти' },
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
            component={Link}
            to={to}
            onClick={handleItemClick}
          >
            <ListItemButton>
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText sx={navItemTextStyle} primary={label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        minHeight: '70vh',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <nav aria-label='main menu items'>{renderNavItems(navItems)}</nav>
    </Box>
  );
}

export default NavBar;
