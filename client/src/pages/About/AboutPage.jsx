import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {
  stylesAboutPageTypography,
  stylesEntityContainerSx,
  stylesRedlineTypography,
} from '@/src/styles';

function AboutPage() {
  return (
    <Container maxWidth='md' sx={stylesEntityContainerSx}>
      <Typography gutterBottom align='center' variant='h4'>
        Про проєкт Home Accounting
      </Typography>

      <Typography gutterBottom sx={stylesRedlineTypography} variant='body1'>
        <strong>Home Accounting</strong> — це система управління домашніми
        фінансами, яка допомагає вам контролювати витрати, доходи та вести облік
        фінансових операцій.
      </Typography>

      <Typography gutterBottom variant='h6'>
        Основні можливості:
      </Typography>

      <Typography component='ul' variant='body1'>
        <Typography component='li'>
          Додавання та управління категоріями витрат.
        </Typography>
        <Typography component='li'>
          Облік фінансових операцій (товари, магазини, валюти, одиниці вимірів).
        </Typography>
        <Typography component='li'>
          Підтримка декількох валют із актуальними курсами.
        </Typography>
        <Typography component='li'>
          Гнучке управління ролями та дозволами користувачів.
        </Typography>
        <Typography component='li'>
          Безпечна аутентифікація за допомогою JWT.
        </Typography>
      </Typography>

      <Typography gutterBottom sx={stylesAboutPageTypography} variant='h6'>
        Технології проєкту:
      </Typography>

      <Typography gutterBottom sx={stylesRedlineTypography} variant='body1'>
        <strong>Backend:</strong> Node.js + Express, MongoDB (для
        аутентифікації), PostgreSQL (для основних даних), Sequelize, Mongoose.
      </Typography>

      <Typography gutterBottom sx={stylesRedlineTypography} variant='body1'>
        <strong>Frontend:</strong> React + Vite, Redux Toolkit (RTK Query),
        Material UI.
      </Typography>

      <Typography gutterBottom sx={stylesRedlineTypography} variant='body1'>
        <strong>Архітектура:</strong> Рольова система доступу з гнучким
        керуванням дозволами.
      </Typography>

      <Typography gutterBottom sx={stylesAboutPageTypography} variant='h6'>
        Контакти та подальший розвиток:
      </Typography>

      <Typography gutterBottom sx={stylesRedlineTypography} variant='body1'>
        Проєкт постійно вдосконалюється. Якщо у Вас є ідеї чи пропозиції,
        зв`яжіться зі мною!
      </Typography>
    </Container>
  );
}

export default AboutPage;
