import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';

import {
  stylesLayoutBox,
  stylesLayoutBoxContainer,
  stylesLayoutOutlet,
  stylesLayoutSideBar,
  stylesLayoutXLContainer,
} from '../../styles';

const {
  HOME_PAGE_TITLES,
  LOGIN_PAGE_TITLES,
  REGISTRATION_PAGE_TITLES,
  RESET_PASSWORD_TITLES,
  ABOUT_PAGE_TITLES,
  CONTACTS_PAGE_TITLES,
  EXPENSES_TITLES,
  ESTABLISHMENTS_TITLES,
  PRODUCTS_TITLES,
  CATEGORIES_TITLES,
  CURRENCIES_TITLES,
  MEASURES_TITLES,
  MODERATION_TITLES,
  USERS_TITLES,
  ROLES_TITLES,
  FORBIDDEN_PAGE_TITLES,
  PROFILE_TITLES,
  EDIT_PROFILE_TITLES,
  PERMISSIONS_PROFILE_TITLES,
  CHANGE_PASSWORD_TITLES,
  REMOVE_PROFILE_TITLES,
  STATISTICS_PAGE_TITLES,
} = pageTitles;

const TITLES_MAP = new Map([
  ['/login', LOGIN_PAGE_TITLES],
  ['/registration', REGISTRATION_PAGE_TITLES],
  ['/forgot-password', RESET_PASSWORD_TITLES],
  ['/redirect', RESET_PASSWORD_TITLES],
  ['/about', ABOUT_PAGE_TITLES],
  ['/contacts', CONTACTS_PAGE_TITLES],
  ['/expenses', EXPENSES_TITLES],
  ['/establishments', ESTABLISHMENTS_TITLES],
  ['/products', PRODUCTS_TITLES],
  ['/categories', CATEGORIES_TITLES],
  ['/currencies', CURRENCIES_TITLES],
  ['/measures', MEASURES_TITLES],
  ['/moderation', MODERATION_TITLES],
  ['/users', USERS_TITLES],
  ['/roles', ROLES_TITLES],
  ['/forbidden', FORBIDDEN_PAGE_TITLES],
  ['/profile', PROFILE_TITLES],
  ['/edit-profile', EDIT_PROFILE_TITLES],
  ['/permissions', PERMISSIONS_PROFILE_TITLES],
  ['/password', CHANGE_PASSWORD_TITLES],
  ['/remove-profile', REMOVE_PROFILE_TITLES],
  ['/statistics', STATISTICS_PAGE_TITLES],
]);

function Layout() {
  const location = useLocation();

  const currentTitles = useMemo(() => {
    for (const [path, titles] of TITLES_MAP) {
      if (location.pathname.startsWith(path)) {
        return titles;
      }
    }
    return HOME_PAGE_TITLES;
  }, [location.pathname]);

  usePageTitle(currentTitles);

  return (
    <Box sx={stylesLayoutBox}>
      <Header />
      <Box sx={stylesLayoutBoxContainer}>
        <Container maxWidth='xl' sx={stylesLayoutXLContainer}>
          <Box sx={stylesLayoutSideBar}>
            <SideBar />
          </Box>
          <Box sx={stylesLayoutOutlet}>
            <Outlet />
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
