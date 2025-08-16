import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { PAGE_TITLES } from '@/src/constants';
import usePageTitle from '@/src/hooks/usePageTitle';

import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import SideBar from '@/src/components/SideBar';

import {
  stylesLayoutBox,
  stylesLayoutBoxContainer,
  stylesLayoutOutlet,
  stylesLayoutSideBar,
  stylesLayoutXLContainer,
} from '@/src/styles';

const TITLES_MAP = new Map([
  ['/auth', PAGE_TITLES.auth],
  ['/redirect', PAGE_TITLES.resetPassword],
  ['/about', PAGE_TITLES.about],
  ['/contacts', PAGE_TITLES.contacts],
  ['/expenses', PAGE_TITLES.expenses],
  ['/establishments', PAGE_TITLES.establishments],
  ['/products', PAGE_TITLES.products],
  ['/categories', PAGE_TITLES.categories],
  ['/currencies', PAGE_TITLES.currencies],
  ['/measures', PAGE_TITLES.measures],
  ['/moderation', PAGE_TITLES.moderation],
  ['/users', PAGE_TITLES.users],
  ['/roles', PAGE_TITLES.roles],
  ['/forbidden', PAGE_TITLES.forbidden],
  ['/profile', PAGE_TITLES.profile],
  ['/edit-profile', PAGE_TITLES.editProfile],
  ['/permissions', PAGE_TITLES.permissionsProfile],
  ['/password', PAGE_TITLES.changePassword],
  ['/remove-profile', PAGE_TITLES.removeProfile],
  ['/statistics', PAGE_TITLES.statistics],
]);

function Layout() {
  const location = useLocation();

  const currentTitles = useMemo(() => {
    for (const [path, titles] of TITLES_MAP) {
      if (location.pathname.startsWith(path)) {
        return titles;
      }
    }
    return PAGE_TITLES.home;
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
