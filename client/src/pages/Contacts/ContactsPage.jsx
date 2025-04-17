import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

import { stylesContactsPageList } from '../../styles';

function ContactsPage() {
  return (
    <Container maxWidth='md' sx={{ py: 2 }}>
      <Typography gutterBottom align='center' variant='h4'>
        Контакти розробника
      </Typography>

      <Typography gutterBottom variant='body1'>
        <strong>Розробник:</strong> Ситніков Олександр.
      </Typography>

      <Typography gutterBottom variant='body1'>
        Ви можете зв`язатися зі мною за такими каналами:
      </Typography>

      <List sx={stylesContactsPageList}>
        <ListItem>
          <ListItemIcon>
            <EmailIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText
            primary='Email'
            secondary={
              <Link
                href='mailto:sytnikov.zp@gmail.com'
                sx={{
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                sytnikov.zp@gmail.com
              </Link>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <GitHubIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText
            primary='GitHub'
            secondary={
              <Link
                href='https://github.com/sytnikovzp'
                rel='noopener'
                sx={{
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
                target='_blank'
              >
                github.com/sytnikovzp
              </Link>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <TelegramIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText
            primary='Telegram'
            secondary={
              <Link
                href='https://t.me/sytnikovzp'
                rel='noopener'
                sx={{
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
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
