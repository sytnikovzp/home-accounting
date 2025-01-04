import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Grid2 } from '@mui/material';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import NavBar from '../Navigation/NavBar';
import ServiceBlock from '../ServiceBlock/ServiceBlock';

import {
  stylesLayoutBox,
  stylesLayoutGridContainer,
  stylesLayoutGridXLContainer,
  stylesLayoutNavBarDesktop,
  stylesLayoutNavBarMobile,
  stylesLayoutOutlet,
  stylesLayoutServiceBlock,
  stylesLayoutXLContainer,
} from '../../styles';

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
    <Box sx={stylesLayoutBox}>
      <Grid2
        container
        direction='column'
        rowSpacing={2}
        sx={stylesLayoutGridContainer}
      >
        <Grid2>
          <Header
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            setIsAuthenticated={setIsAuthenticated}
            setAuthModalOpen={setAuthModalOpen}
          />
        </Grid2>
        <Container maxWidth='xl' sx={stylesLayoutXLContainer}>
          <Grid2 container columnSpacing={2} sx={stylesLayoutGridXLContainer}>
            <Grid2 xs={12} md={2} sx={stylesLayoutNavBarDesktop}>
              <NavBar />
            </Grid2>
            <Grid2 sx={stylesLayoutNavBarMobile}>
              {isNavBarOpen && <NavBar onClose={handleCloseNavBar} />}
            </Grid2>
            <Grid2 sx={stylesLayoutOutlet}>
              <Outlet />
            </Grid2>
            <Grid2 xs={12} md='auto' sx={stylesLayoutServiceBlock}>
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
