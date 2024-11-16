import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import UserIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import ProductIcon from '@mui/icons-material/Storefront';
import ShopIcon from '@mui/icons-material/Store';
import PurchaseIcon from '@mui/icons-material/ShoppingCart';
import RoleIcon from '@mui/icons-material/ManageAccounts';
// ==============================================================
import { navItemTextStyle } from '../../services/styleService';

const navItems = [
  { to: '/', icon: <HomeIcon />, label: 'Головна' },
  { to: '/purchases', icon: <PurchaseIcon />, label: 'Покупки' },
  { to: '/shops', icon: <ShopIcon />, label: 'Магазини' },
  { to: '/products', icon: <ProductIcon />, label: 'Продукти' },
  { to: '/categories', icon: <CategoryIcon />, label: 'Категорії' },
  { to: '/users', icon: <UserIcon />, label: 'Користувачі' },
  { to: '/roles', icon: <RoleIcon />, label: 'Ролі' },
];

function NavBar() {
  const renderNavItems = (items) => (
    <List>
      {items.map(({ to, icon, label }) => (
        <ListItem disablePadding key={label} component={Link} to={to}>
          <ListItemButton>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText sx={navItemTextStyle} primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '70vh',
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
