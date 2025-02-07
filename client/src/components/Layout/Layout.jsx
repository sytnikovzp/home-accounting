import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Grid2, useMediaQuery, useTheme } from '@mui/material';

import { pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import NavBar from '../Navigation/NavBar';
import ServiceBlock from '../ServiceBlock/ServiceBlock';

import {
  stylesLayoutBox,
  stylesLayoutGridContainer,
  stylesLayoutNavBarDesktop,
  stylesLayoutNavBarMobile,
  stylesLayoutOutlet,
  stylesLayoutServiceBlock,
  stylesLayoutXLContainer,
  stylesLayoutXLGridContainer,
} from '../../styles';

const {
  AUTH_PAGE_TITLES,
  CATEGORIES_TITLES,
  CHANGE_PASSWORD_TITLES,
  CURRENCIES_TITLES,
  EDIT_PROFILE_TITLES,
  ESTABLISHMENTS_TITLES,
  EXPENSES_TITLES,
  HOME_PAGE_TITLES,
  MEASURES_TITLES,
  MODERATION_TITLES,
  NOTIFICATION_PAGE_TITLES,
  PERMISSIONS_PROFILE_TITLES,
  PRODUCTS_TITLES,
  PROFILE_TITLES,
  REMOVE_PROFILE_TITLES,
  RESET_PASSWORD_TITLES,
  ROLES_TITLES,
  USERS_TITLES,
} = pageTitles;

const TITLES_MAP = new Map([
  ['/auth', AUTH_PAGE_TITLES],
  ['/categories', CATEGORIES_TITLES],
  ['/currencies', CURRENCIES_TITLES],
  ['/establishments', ESTABLISHMENTS_TITLES],
  ['/expenses', EXPENSES_TITLES],
  ['/measures', MEASURES_TITLES],
  ['/moderation', MODERATION_TITLES],
  ['/products', PRODUCTS_TITLES],
  ['/roles', ROLES_TITLES],
  ['/users', USERS_TITLES],
  ['/notification', NOTIFICATION_PAGE_TITLES],
  ['/reset-password', RESET_PASSWORD_TITLES],
  ['/profile', PROFILE_TITLES],
  ['/edit-profile', EDIT_PROFILE_TITLES],
  ['/permissions', PERMISSIONS_PROFILE_TITLES],
  ['/password', CHANGE_PASSWORD_TITLES],
  ['/remove-profile', REMOVE_PROFILE_TITLES],
]);

function Layout() {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentTitles = useMemo(() => {
    for (const [path, titles] of TITLES_MAP) {
      if (location.pathname.startsWith(path)) {
        return titles;
      }
    }
    return HOME_PAGE_TITLES;
  }, [location.pathname]);

  usePageTitle(currentTitles);

  useEffect(() => {
    if (!isMobile) {
      setIsNavBarOpen(false);
    }
  }, [isMobile]);

  const handleToggleNavBar = useCallback(() => {
    setIsNavBarOpen((prev) => !prev);
  }, []);

  return (
    <Box sx={stylesLayoutBox}>
      <Grid2
        container
        direction='column'
        rowSpacing={2}
        sx={stylesLayoutGridContainer}
      >
        <Grid2>
          <Header />
        </Grid2>
        <Container maxWidth='xl' sx={stylesLayoutXLContainer}>
          <Grid2 container columnSpacing={2} sx={stylesLayoutXLGridContainer}>
            {!isMobile && (
              <Grid2 md={2} sx={stylesLayoutNavBarDesktop}>
                <NavBar />
              </Grid2>
            )}
            {isMobile && isNavBarOpen && (
              <Grid2 sx={stylesLayoutNavBarMobile}>
                <NavBar onClose={handleToggleNavBar} />
              </Grid2>
            )}
            <Grid2 sx={stylesLayoutOutlet}>
              <Outlet />
            </Grid2>
            <Grid2 md='auto' sx={stylesLayoutServiceBlock} xs={12}>
              <ServiceBlock />
            </Grid2>
          </Grid2>
        </Container>
      </Grid2>
      <Grid2 sx={{ flexShrink: 0 }}>
        <Footer />
      </Grid2>
    </Box>
  );
}

export default Layout;
