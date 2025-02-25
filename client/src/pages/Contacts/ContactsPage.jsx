import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

function ContactsPage() {
  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography gutterBottom align='center' variant='h4'>
        Контакти розробника
      </Typography>
      <Typography gutterBottom variant='body1'>
        <strong>Розробник:</strong> Ситніков Олександр
      </Typography>
      <Typography gutterBottom variant='body1'>
        Ви можете зв`язатися зі мною за такими каналами:
      </Typography>
      <List sx={{ pl: 2 }}>
        <ListItem>
          <EmailIcon fontSize='large' sx={{ mr: 1 }} />
          <ListItemText
            primary='Email'
            secondary={
              <Link
                href='mailto:sytnikov.zp@gmail.com'
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                sytnikov.zp@gmail.com
              </Link>
            }
          />
        </ListItem>
        <ListItem>
          <GitHubIcon fontSize='large' sx={{ mr: 1 }} />
          <ListItemText
            primary='GitHub'
            secondary={
              <Link
                href='https://github.com/sytnikovzp'
                rel='noopener'
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                target='_blank'
              >
                github.com/sytnikovzp
              </Link>
            }
          />
        </ListItem>
        <ListItem>
          <TelegramIcon fontSize='large' sx={{ mr: 1 }} />
          <ListItemText
            primary='Telegram'
            secondary={
              <Link
                href='https://t.me/sytnikovzp'
                rel='noopener'
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                target='_blank'
              >
                @sytnikovzp
              </Link>
            }
          />
        </ListItem>
      </List>
    </Container>
  );
}

export default ContactsPage;
