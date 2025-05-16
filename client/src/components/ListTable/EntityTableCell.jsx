import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { API_CONFIG } from '../../constants';

import {
  stylesEntityTableCellAvatarBox,
  stylesEntityTableCellAvatarSize,
  stylesEntityTableCellCell,
  stylesEntityTableCellRouterLink,
  stylesEntityTableCellTextColor,
  stylesEntityTableCellTypography,
} from '../../styles';

const getAvatarPath = (field, value) => {
  const basePath = `${API_CONFIG.BASE_URL.replace('/api', '')}/images/`;
  if (!value) {
    return field === 'logo' ? `${basePath}noLogo.png` : null;
  }
  return `${basePath}${field === 'logo' ? 'establishments' : 'users'}/${value}`;
};

function EntityTableCell({ col, linkEntity, row }) {
  const { field, align = 'center' } = col;
  const cellValue = row[field];

  const avatarPath = useMemo(
    () => getAvatarPath(field, cellValue),
    [field, cellValue]
  );

  if (field === 'logo' || field === 'photo') {
    return (
      <TableCell align={align} sx={stylesEntityTableCellCell}>
        <Box sx={stylesEntityTableCellAvatarBox}>
          <Avatar
            alt={field === 'logo' ? 'Логотип закладу' : 'Фото користувача'}
            src={avatarPath}
            sx={stylesEntityTableCellAvatarSize}
            variant='rounded'
          />
        </Box>
      </TableCell>
    );
  }

  if (field === 'title' && linkEntity === 'moderation') {
    return (
      <TableCell align={align} sx={stylesEntityTableCellCell}>
        <Typography sx={stylesEntityTableCellTextColor} variant='body1'>
          {cellValue}
        </Typography>
      </TableCell>
    );
  }

  const isLinkedField = ['title', 'product', 'fullName'].includes(field);

  return (
    <TableCell align={align} sx={stylesEntityTableCellCell}>
      {isLinkedField ? (
        <RouterLink
          style={stylesEntityTableCellRouterLink}
          to={`/${linkEntity}/${row.uuid}`}
        >
          <Typography
            component='span'
            sx={stylesEntityTableCellTypography}
            variant='body1'
          >
            {cellValue}
          </Typography>
        </RouterLink>
      ) : (
        <Typography sx={stylesEntityTableCellTextColor} variant='body1'>
          {cellValue}
        </Typography>
      )}
    </TableCell>
  );
}

export default EntityTableCell;
