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

import {
  stylesHomePageBox,
  stylesHomePageCard,
  stylesHomePageCardActions,
  stylesHomePageGridContainer,
  stylesHomePageGridPanel,
  stylesRedlineTypography,
} from '../../styles';

const panelData = [
  {
    key: 'panel1',
    icon: <AccountBoxIcon />,
    title: 'Управління користувачами',
    items: [
      'Реєстрація та авторизація користувачів через email та пароль.',
      'Підтримка кількох ролей користувачів: адміністратори, модератори та звичайні користувачі.',
      'Керування правами доступу через систему ролей, що дозволяє контролювати доступ до функцій.',
      'Система дозволяє розширювати та змінювати права ролей користувачів відповідно до потреб.',
    ],
  },
  {
    key: 'panel2',
    icon: <AttachMoneyIcon />,
    title: 'Облік витрат',
    items: [
      'Легке додавання нових витрат з вказанням суми, категорії, закладу та валюти.',
      'Сортування та фільтрація витрат по категоріях, закладах та за товарами та послугами.',
      'Витрати можна переглядати за періодами (день, тиждень, місяць, рік).',
      'Кожен користувач бачить лише власні витрати.',
      'Усі витрати в додатку ведуться в українській гривні.',
    ],
  },
  {
    key: 'panel3',
    icon: <CategoryIcon />,
    title: 'Категорії та товари/послуги',
    items: [
      'Створення та управління категоріями для витрат.',
      'Легке додавання товарів або послуг для кожної транзакції.',
      'Можливість змінювати категорії та товари/послуги в разі потреби.',
      'Можливість створювати та редагувати одиниці виміру для товарів та послуг.',
    ],
  },
  {
    key: 'panel4',
    icon: <BarChartIcon />,
    title: 'Візуалізація даних статистики',
    items: [
      'Витрати можна відслідковувати за категоріями, закладами, товарами та послугами.',
      'Перегляд даних за різні періоди часу: день, тиждень, місяць, рік.',
      'Аналітика для відслідковування тенденцій фінансів за різними параметрами.',
    ],
  },
  {
    key: 'panel5',
    icon: <SmartphoneIcon />,
    title: 'Мобільна адаптація',
    items: [
      'Гнучкий дизайн для роботи на різних пристроях, в тому числі на мобільних пристроях.',
      'Адаптивний інтерфейс для зручності користування на різних екранах.',
    ],
  },
  {
    key: 'panel6',
    icon: <SettingsIcon />,
    title: 'Система ролей та прав доступу',
    items: [
      'Гнучка система ролей: адміністратори, модератори та користувачі.',
      'Ролі визначають доступ до функцій: адміністратори можуть керувати користувачами, модератори — контентом, а користувачі — своїми витратами.',
      'Адміністратори можуть створювати, редагувати та видаляти користувачів, управління ролями та правами доступу.',
      'Модератори мають доступ до редагування категорій, закладів та товарів.',
    ],
  },
];

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

  return (
    <Container maxWidth='md' sx={{ py: 2 }}>
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
        {panelData.map(({ key, icon, title, items }) => (
          <Grid key={key} size={{ xs: 12, sm: 6 }} sx={stylesHomePageGridPanel}>
            <Card sx={stylesHomePageCard}>
              <CardActions
                sx={stylesHomePageCardActions}
                onClick={getToggleHandler(key)}
              >
                <Box sx={stylesHomePageBox}>
                  {icon}
                  <Typography variant='body1'>{title}</Typography>
                </Box>
                <IconButton size='small'>
                  <ExpandMoreIcon
                    sx={{
                      transform: openPanels.has(key)
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </IconButton>
              </CardActions>

              <Collapse unmountOnExit in={openPanels.has(key)} timeout='auto'>
                <CardContent>
                  <List>
                    {items.map((item, index) => (
                      <ListItem key={index}>
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
