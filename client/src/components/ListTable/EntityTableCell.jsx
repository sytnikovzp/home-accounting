import { Link as RouterLink } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { configs } from '../../constants';

import {
  stylesListTableAvatarBox,
  stylesListTableAvatarSize,
  stylesListTableCell,
  stylesListTableTableTypography,
  stylesListTableTextColor,
} from '../../styles';

const { BASE_URL } = configs;

function EntityTableCell({ col, row, linkEntity }) {
  let avatarPath = null;
  if (row[col.field]) {
    avatarPath = `${BASE_URL.replace('/api', '')}/images/${
      col.field === 'logo' ? 'establishments' : 'users'
    }/${row[col.field]}`;
  } else if (col.field === 'logo') {
    avatarPath = `${BASE_URL.replace('/api', '')}/images/noLogo.png`;
  }

  if (col.field === 'logo' || col.field === 'photo') {
    return (
      <TableCell align={col.align || 'center'} sx={stylesListTableCell}>
        <Box sx={stylesListTableAvatarBox}>
          <Avatar
            alt={col.field === 'logo' ? 'Логотип закладу' : 'Фото користувача'}
            src={avatarPath}
            sx={stylesListTableAvatarSize}
            variant='rounded'
          />
        </Box>
      </TableCell>
    );
  }

  if (col.field === 'title' && linkEntity === 'moderation') {
    return (
      <TableCell align={col.align || 'center'} sx={stylesListTableCell}>
        <Typography sx={stylesListTableTextColor} variant='body1'>
          {row[col.field]}
        </Typography>
      </TableCell>
    );
  }

  if (['title', 'product', 'fullName'].includes(col.field)) {
    return (
      <TableCell align={col.align || 'center'} sx={stylesListTableCell}>
        <RouterLink
          style={{ textDecoration: 'none' }}
          to={`/${linkEntity}/${row.uuid}`}
        >
          <Typography
            component='span'
            sx={stylesListTableTableTypography}
            variant='body1'
          >
            {row[col.field]}
          </Typography>
        </RouterLink>
      </TableCell>
    );
  }

  return (
    <TableCell align={col.align || 'center'} sx={stylesListTableCell}>
      <Typography sx={stylesListTableTextColor} variant='body1'>
        {row[col.field]}
      </Typography>
    </TableCell>
  );
}

export default EntityTableCell;
