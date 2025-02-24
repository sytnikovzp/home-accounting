import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';

import { pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Grid
        container
        direction='column'
        rowSpacing={2}
        sx={{
          backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
          flexGrow: 1,
        }}
      >
        <Header />
        <Container
          maxWidth='xl'
          sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          <Grid
            container
            columnSpacing={2}
            sx={{ flexGrow: 1, flexWrap: 'nowrap' }}
          >
            <Grid
              sx={{
                display: { md: 'flex', xs: 'block' },
                flexShrink: 0,
                maxWidth: 'calc(100% - 190px)',
              }}
              xs={4}
            >
              <SideBar />
            </Grid>
            <Grid
              sx={{
                flexBasis: '0',
                flexGrow: 1,
                maxWidth: '100%',
                minWidth: 0,
                overflowX: 'auto',
              }}
            >
              <Outlet />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid sx={{ flexShrink: 0 }}>
        <Footer />
      </Grid>
    </Box>
  );
}

export default Layout;
