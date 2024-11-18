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
            component={RouterLink}
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
      component='nav'
      aria-label='main menu items'
      sx={{
        position: { md: 'sticky', xs: 'static' },
        top: 0,
        minHeight: { md: '70vh', xs: 'auto' },
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: { md: 'column', xs: 'row' },
        alignItems: { md: 'center', xs: 'flex-start' },
        justifyContent: { md: 'flex-start', xs: 'space-between' },
        borderRight: { md: '1px solid rgba(0, 0, 0, 0.1)', xs: 'none' },
      }}
    >
      {renderNavItems(navItems)}
    </Box>
  );
}

export default NavBar;
