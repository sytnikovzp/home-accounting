import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

import { PANEL_DATA } from '../../constants';

import {
  stylesEntityContainerSx,
  stylesHomePageBox,
  stylesHomePageCard,
  stylesHomePageCardActions,
  stylesHomePageGridContainer,
  stylesHomePageGridPanel,
  stylesHomePageGridSize,
  stylesRedlineTypography,
} from '../../styles';

const iconMap = {
  account: <AccountBoxIcon />,
  money: <AttachMoneyIcon />,
  chart: <BarChartIcon />,
  category: <CategoryIcon />,
  settings: <SettingsIcon />,
  phone: <SmartphoneIcon />,
};

function HomePage() {
  const [openPanels, setOpenPanels] = useState(new Set());

  const handleToggle = useCallback((panel) => {
    setOpenPanels((prev) => {
      const newSet = new Set(prev);
      newSet.has(panel) ? newSet.delete(panel) : newSet.add(panel);
      return newSet;
    });
  }, []);

  const getToggleHandler = useCallback(
    (panel) => () => handleToggle(panel),
    [handleToggle]
  );

  const getExpandIconSx = (isOpen) => ({
    transition: 'transform 0.3s',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  });

  return (
    <Container maxWidth='md' sx={stylesEntityContainerSx}>
      <Typography gutterBottom align='center' variant='h4'>
        Огляд функціоналу Home Accounting
      </Typography>

      <Typography gutterBottom sx={stylesRedlineTypography} variant='body1'>
        <strong>Home Accounting</strong> — це простий та зручний інструмент для
        ведення обліку особистих фінансів. За допомогою цього додатку ви зможете
        ефективно управляти своїми доходами та витратами, переглядати статистику
        та багато іншого.
      </Typography>

      <Grid
        container
        alignItems='flex-start'
        justifyContent='center'
        spacing={2}
        sx={stylesHomePageGridContainer}
      >
        {PANEL_DATA.map(({ key, icon, title, items }) => (
          <Grid
            key={key}
            size={stylesHomePageGridSize}
            sx={stylesHomePageGridPanel}
          >
            <Card sx={stylesHomePageCard}>
              <CardActions
                sx={stylesHomePageCardActions}
                onClick={getToggleHandler(key)}
              >
                <Box sx={stylesHomePageBox}>
                  {iconMap[icon]}
                  <Typography variant='body1'>{title}</Typography>
                </Box>
                <IconButton size='small'>
                  <ExpandMoreIcon sx={getExpandIconSx(openPanels.has(key))} />
                </IconButton>
              </CardActions>

              <Collapse unmountOnExit in={openPanels.has(key)} timeout='auto'>
                <CardContent>
                  <List>
                    {items.map((item) => (
                      <ListItem key={item}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HomePage;
