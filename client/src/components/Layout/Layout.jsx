import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
// =============================================
import { Outlet } from 'react-router-dom';
// =============================================
import Header from '../Header/Header';
import DrawerMenu from '../Navigation/DrawerMenu';
import ServiceBlock from '../ServiceBlock/ServiceBlock';
import Footer from '../Footer/Footer';

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Grid2
        container
        direction={'column'}
        sx={{
          flexGrow: 1,
          color: 'text.primary',
          backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
        }}
      >
        <Grid2 item lg={12} md={12} xl={12} sm={12} xs={12}>
          <Header />
        </Grid2>
        <Grid2 container sx={{ mt: '1rem', mb: '1rem', flex: 1 }}>
          <Grid2 item lg={2} md={2} xl={2} sm={2} xs={2}>
            <DrawerMenu />
          </Grid2>
          <Grid2 item lg={6} md={6} xl={6} sm={6} xs={6}>
            <Outlet />
          </Grid2>
          <Grid2 item lg={4} md={4} xl={4} sm={4} xs={4}>
            <ServiceBlock />
          </Grid2>
        </Grid2>
        <Grid2 item lg={12} md={12} xl={12} sm={12} xs={12}>
          <Footer />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Layout;
