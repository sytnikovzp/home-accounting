import Box from '@mui/material/Box';
import List from '@mui/material/List';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import StoreIcon from '@mui/icons-material/Store';

import NavItem from './NavItem';

const navItems = [
  { icon: HomeIcon, label: 'Головна', to: '/' },
  { icon: ShoppingCartIcon, label: 'Витрати', to: '/expenses' },
  { icon: StoreIcon, label: 'Заклади', to: '/establishments' },
  { icon: DryCleaningIcon, label: 'Товари та послуги', to: '/products' },
  { icon: CategoryIcon, label: 'Категорії витрат', to: '/categories' },
  { icon: AttachMoneyIcon, label: 'Валюти', to: '/currencies' },
  { icon: SquareFootIcon, label: 'Одиниці вимірів', to: '/measures' },
  { icon: GavelIcon, label: 'Модерація контенту', to: '/moderation' },
  { icon: PeopleIcon, label: 'Користувачі', to: '/users' },
  { icon: ManageAccountsIcon, label: 'Ролі користувачів', to: '/roles' },
];

function NavBar() {
  return (
    <Box aria-label='main menu items' component='nav'>
      <List>
        {navItems.map(({ to, icon, label }) => (
          <NavItem key={label} icon={icon} label={label} to={to} />
        ))}
      </List>
    </Box>
  );
}

export default NavBar;
