import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Grid2, useMediaQuery, useTheme } from '@mui/material';

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

function Layout() {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
