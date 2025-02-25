import { useState } from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
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
import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

function HomePage() {
  const [openPanels, setOpenPanels] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
    panel5: false,
    panel6: false,
    panel7: false,
  });

  const handleToggle = (panel) => {
    setOpenPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography gutterBottom align='center' variant='h4'>
        Огляд функціоналу Home Accounting
      </Typography>

      <Typography
        gutterBottom
        sx={{ textIndent: '2em', textAlign: 'justify' }}
        variant='body1'
      >
        <strong>Home Accounting</strong> — це простий та зручний інструмент для
        ведення обліку особистих фінансів. За допомогою цього додатку ви зможете
        ефективно управляти своїми доходами та витратами, створювати звіти,
        переглядати статистику та багато іншого.
      </Typography>

      <Grid container spacing={3}>
        {[
          {
            key: 'panel1',
            icon: <AccountBoxIcon sx={{ mr: 1 }} />,
            title: '1. Управління користувачами та ролями',
            items: [
              'Реєстрація та авторизація користувачів.',
              'Підтримка кількох ролей користувачів: адміністратори, модератори та звичайні користувачі.',
              'Керування правами доступу через систему ролей.',
            ],
          },
          {
            key: 'panel2',
            icon: <AttachMoneyIcon sx={{ mr: 1 }} />,
            title: '2. Облік доходів та витрат',
            items: [
              'Легке додавання нових транзакцій.',
              'Сортування та фільтрація по категоріях, датах та сумі витрат.',
              'Підтримка декількох валют для кожної транзакції.',
            ],
          },
          {
            key: 'panel3',
            icon: <CategoryIcon sx={{ mr: 1 }} />,
            title: '3. Категорії та товари',
            items: [
              'Створення та управління категоріями для витрат.',
              'Легке додавання товарів або послуг для кожної транзакції.',
              'Можливість зміни категорій та товарів та послугах у разі потреби.',
            ],
          },
          {
            key: 'panel4',
            icon: <BarChartIcon sx={{ mr: 1 }} />,
            title: '4. Візуалізація даних',
            items: [
              'Графіки для відображення витрат по критеріям за період.',
              'Перегляд даних за різні періоди часу: день, тиждень, місяць, рік.',
              'Аналітика для відслідковування тенденцій ваших фінансів.',
            ],
          },
          {
            key: 'panel5',
            icon: <PublicIcon sx={{ mr: 1 }} />,
            title: '5. Публічні сторінки для гостей',
            items: [
              'Сторінка «Про проєкт для незареєстрованих користувачів.',
              "Контактна інформація для можливості зв'язку.",
            ],
          },
          {
            key: 'panel6',
            icon: <SmartphoneIcon sx={{ mr: 1 }} />,
            title: '6. Мобільна адаптація',
            items: [
              'Гнучкий дизайн для роботи на різних пристроях.',
              'Адаптивний інтерфейс для зручності користування на мобільних телефонах.',
            ],
          },
          {
            key: 'panel7',
            icon: <SettingsIcon sx={{ mr: 1 }} />,
            title: '7. Персоналізація',
            items: [
              'Налаштування профілю користувача: аватар та персональні дані.',
              'Підтримка різних мір та валют для налаштування системи під Ваші потреби.',
            ],
          },
        ].map(({ key, icon, title, items }) => (
          <Grid key={key} xs={12}>
            <Card>
              <CardActions
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => handleToggle(key)}
              >
                <Typography variant='body1'>
                  {icon}
                  {title}
                </Typography>
                <IconButton>
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>

              <Collapse unmountOnExit in={openPanels[key]} timeout='auto'>
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
