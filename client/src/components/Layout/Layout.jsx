import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// ==============================================================
import { Box, Grid2, Container } from '@mui/material';
// ==============================================================
import Header from '../Header/Header';
import NavBar from '../Navigation/NavBar';
import ServiceBlock from '../ServiceBlock/ServiceBlock';
import Footer from '../Footer/Footer';

function Layout() {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);

  const handleToggleNavBar = () => {
    setIsNavBarOpen((prev) => !prev);
  };

  const handleCloseNavBar = () => {
    setIsNavBarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Grid2
        container
        direction='column'
        rowSpacing={2}
        sx={{
          flexGrow: 1,
          color: 'text.primary',
          backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
        }}
      >
        <Grid2>
          <Header onToggleNavBar={handleToggleNavBar} />
        </Grid2>
        <Grid2 container sx={{ flex: 1 }}>
          <Container maxWidth='xl'>
            <Grid2 container columnSpacing={2} alignItems='flex-start'>
              <Grid2
                sx={{
                  width: '190px',
                  flexShrink: 0,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                <NavBar />
              </Grid2>
              <Grid2 sx={{ display: { xs: 'block', md: 'none' } }}>
                {isNavBarOpen && <NavBar onClose={handleCloseNavBar} />}
              </Grid2>
              <Grid2 sx={{ flexGrow: 1 }}>
                <Outlet />
              </Grid2>
              <Grid2 sx={{ flexShrink: 0 }}>
                <ServiceBlock />
              </Grid2>
            </Grid2>
          </Container>
        </Grid2>
        <Grid2>
          <Footer />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Layout;
