import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// ==============================================================
import { Box, Grid2, Container } from '@mui/material';
// ==============================================================
import {
  stylesBoxLayout,
  stylesGridContainer,
  stylesXLContainer,
  stylesGridXLContainer,
  stylesNavBarDesktop,
  stylesNavBarMobile,
  stylesOutlet,
  stylesServiceBlock,
} from '../../styles/theme';
// ==============================================================
import Header from '../Header/Header';
import NavBar from '../Navigation/NavBar';
import ServiceBlock from '../ServiceBlock/ServiceBlock';
import Footer from '../Footer/Footer';

function Layout({
  isAuthenticated,
  currentUser,
  setIsAuthenticated,
  setAuthModalOpen,
}) {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);

  const handleCloseNavBar = () => {
    setIsNavBarOpen(false);
  };

  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setIsNavBarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box sx={stylesBoxLayout}>
      <Grid2
        container
        direction='column'
        rowSpacing={2}
        sx={stylesGridContainer}
      >
        <Grid2>
          <Header
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            setIsAuthenticated={setIsAuthenticated}
            setAuthModalOpen={setAuthModalOpen}
          />
        </Grid2>
        <Container maxWidth='xl' sx={stylesXLContainer}>
          <Grid2 container columnSpacing={2} sx={stylesGridXLContainer}>
            <Grid2 xs={12} md={2} sx={stylesNavBarDesktop}>
              <NavBar />
            </Grid2>
            <Grid2 sx={stylesNavBarMobile}>
              {isNavBarOpen && <NavBar onClose={handleCloseNavBar} />}
            </Grid2>
            <Grid2 sx={stylesOutlet}>
              <Outlet />
            </Grid2>
            <Grid2 xs={12} md='auto' sx={stylesServiceBlock}>
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
