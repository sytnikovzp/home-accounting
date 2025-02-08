import { useMemo } from 'react';
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

const getAvatarPath = (field, value) => {
  const basePath = `${BASE_URL.replace('/api', '')}/images/`;
  if (!value) {
    return field === 'logo' ? `${basePath}noLogo.png` : null;
  }
  return `${basePath}${field === 'logo' ? 'establishments' : 'users'}/${value}`;
};

function EntityTableCell({ col, row, linkEntity }) {
  const { field, align = 'center' } = col;
  const cellValue = row[field];

  const avatarPath = useMemo(
    () => getAvatarPath(field, cellValue),
    [field, cellValue]
  );

  if (field === 'logo' || field === 'photo') {
    return (
      <TableCell align={align} sx={stylesListTableCell}>
        <Box sx={stylesListTableAvatarBox}>
          <Avatar
            alt={field === 'logo' ? 'Логотип закладу' : 'Фото користувача'}
            src={avatarPath}
            sx={stylesListTableAvatarSize}
            variant='rounded'
          />
        </Box>
      </TableCell>
    );
  }

  if (field === 'title' && linkEntity === 'moderation') {
    return (
      <TableCell align={align} sx={stylesListTableCell}>
        <Typography sx={stylesListTableTextColor} variant='body1'>
          {cellValue}
        </Typography>
      </TableCell>
    );
  }

  const isLinkedField = ['title', 'product', 'fullName'].includes(field);

  return (
    <TableCell align={align} sx={stylesListTableCell}>
      {isLinkedField ? (
        <RouterLink
          style={{ textDecoration: 'none' }}
          to={`/${linkEntity}/${row.uuid}`}
        >
          <Typography
            component='span'
            sx={stylesListTableTableTypography}
            variant='body1'
          >
            {cellValue}
          </Typography>
        </RouterLink>
      ) : (
        <Typography sx={stylesListTableTextColor} variant='body1'>
          {cellValue}
        </Typography>
      )}
    </TableCell>
  );
}

export default EntityTableCell;
