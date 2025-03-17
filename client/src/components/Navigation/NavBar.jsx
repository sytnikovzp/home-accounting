import Box from '@mui/material/Box';
import List from '@mui/material/List';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import StoreIcon from '@mui/icons-material/Store';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';

import useAuthUser from '../../hooks/useAuthUser';
import useHasPermission from '../../hooks/useHasPermission';

import NavItem from './NavItem';

const publicNavItems = [
  { icon: HomeIcon, label: 'Головна', to: '/' },
  {
    icon: EqualizerIcon,
    label: 'Демо статистики',
    to: '/statistics',
  },
  { icon: InfoIcon, label: 'Про проєкт', to: '/about' },
  { icon: ContactMailIcon, label: 'Контакти', to: '/contacts' },
];

const privateNavItems = [
  { icon: HomeIcon, label: 'Головна', to: '/' },
  {
    icon: EqualizerIcon,
    label: 'Статистика витрат',
    to: '/statistics',
    entity: 'expenses',
    permissions: ['add', 'edit', 'remove'],
  },
  {
    icon: ShoppingCartIcon,
    label: 'Витрати',
    to: '/expenses',
    entity: 'expenses',
    permissions: ['add', 'edit', 'remove'],
  },
  {
    icon: StoreIcon,
    label: 'Заклади',
    to: '/establishments',
    entity: 'establishments',
    permissions: ['add', 'edit', 'remove'],
  },
  {
    icon: TakeoutDiningIcon,
    label: 'Товари та послуги',
    to: '/products',
    entity: 'products',
    permissions: ['add', 'edit', 'remove'],
  },
  {
    icon: CategoryIcon,
    label: 'Категорії витрат',
    to: '/categories',
    entity: 'categories',
    permissions: ['add', 'edit', 'remove'],
  },
  {
    icon: AttachMoneyIcon,
    label: 'Валюти',
    to: '/currencies',
    entity: 'currencies',
    permissions: ['add', 'edit', 'remove'],
  },
  {
    icon: SquareFootIcon,
    label: 'Одиниці вимірів',
    to: '/measures',
    entity: 'measures',
    permissions: ['add', 'edit', 'remove'],
  },
  {
    icon: GavelIcon,
    label: 'Модерація контенту',
    to: '/moderation',
    entity: 'moderation',
    permissions: ['category', 'product', 'establishment'],
  },
  {
    icon: PeopleIcon,
    label: 'Користувачі',
    to: '/users',
    entity: 'users',
    permissions: ['fullView', 'limitedView', 'edit', 'remove'],
  },
  {
    icon: ManageAccountsIcon,
    label: 'Ролі користувачів',
    to: '/roles',
    entity: 'roles',
    permissions: ['add', 'edit', 'remove', 'assign'],
  },
];

function NavBar({ onClose }) {
  const { isAuthenticated } = useAuthUser();
  const { hasPermission } = useHasPermission();

  const filteredNavItems = isAuthenticated
    ? privateNavItems.filter(({ entity, permissions }) => {
        if (!entity || !permissions) {
          return true;
        }
        return permissions.some((permission) =>
          hasPermission(entity, permission)
        );
      })
    : publicNavItems;

  return (
    <Box aria-label='main menu items' component='nav'>
      <List>
        {filteredNavItems.map(({ to, icon, label }) => (
          <NavItem
            key={label}
            icon={icon}
            label={label}
            to={to}
            onClick={onClose}
          />
        ))}
      </List>
    </Box>
  );
}

export default NavBar;
