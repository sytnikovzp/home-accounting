import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function AboutPage() {
  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography gutterBottom align='center' variant='h4'>
        Про проєкт Home Accounting
      </Typography>

      <Typography
        gutterBottom
        sx={{ textIndent: '2em', textAlign: 'justify' }}
        variant='body1'
      >
        <strong>Home Accounting</strong> — це система управління домашніми
        фінансами, яка допомагає вам контролювати витрати, доходи та вести облік
        фінансових операцій.
      </Typography>

      <Typography gutterBottom variant='h6'>
        Основні можливості:
      </Typography>

      <Typography component='ul' sx={{ pl: 3 }} variant='body1'>
        <li>Додавання та управління категоріями витрат.</li>
        <li>
          Облік фінансових операцій (товари, магазини, валюти, одиниці виміру).
        </li>
        <li>Підтримка декількох валют із актуальними курсами.</li>
        <li>Гнучке управління ролями та дозволами користувачів.</li>
        <li>Безпечна аутентифікація за допомогою JWT.</li>
      </Typography>

      <Typography gutterBottom sx={{ mt: 2 }} variant='h6'>
        Технології проєкту:
      </Typography>

      <Typography gutterBottom variant='body1'>
        <strong>Backend:</strong> Node.js + Express, MongoDB (для
        аутентифікації), PostgreSQL (для основних даних), Sequelize, Mongoose.
      </Typography>

      <Typography gutterBottom variant='body1'>
        <strong>Frontend:</strong> React + Vite, Redux Toolkit (RTK Query),
        Material UI.
      </Typography>

      <Typography gutterBottom variant='body1'>
        <strong>Архітектура:</strong> Рольова система доступу з гнучким
        керуванням дозволами.
      </Typography>

      <Typography gutterBottom sx={{ mt: 2 }} variant='h6'>
        Контакти та подальший розвиток:
      </Typography>

      <Typography gutterBottom variant='body1'>
        Проєкт постійно вдосконалюється. Якщо у вас є ідеї чи пропозиції,
        зв`яжіться зі мною!
      </Typography>
    </Container>
  );
}

export default AboutPage;
