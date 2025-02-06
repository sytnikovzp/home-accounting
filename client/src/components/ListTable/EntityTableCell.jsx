import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, TableCell, Typography } from '@mui/material';

import { configs } from '../../constants';

import {
  stylesListTableAvatarBox,
  stylesListTableAvatarSize,
  stylesListTableCell,
  stylesListTableTableTypography,
  stylesListTableTextColor,
} from '../../styles';

const { BASE_URL } = configs;

function EntityTableCell({ col, row, isModerationPage, linkEntity }) {
  return (
    <TableCell
      key={col.field}
      align={col.align || 'center'}
      sx={stylesListTableCell}
    >
      {(() => {
        if (['logo', 'photo'].includes(col.field)) {
          return (
            <Box sx={stylesListTableAvatarBox}>
              <Avatar
                alt={
                  col.field === 'logo' ? 'Логотип закладу' : 'Фото користувача'
                }
                src={(() => {
                  if (row[col.field]) {
                    return `${BASE_URL.replace('/api', '')}/images/${
                      col.field === 'logo' ? 'establishments' : 'users'
                    }/${row[col.field]}`;
                  }
                  if (col.field === 'logo') {
                    return `${BASE_URL.replace('/api', '')}/images/noLogo.png`;
                  }
                  return null;
                })()}
                sx={stylesListTableAvatarSize}
                variant='rounded'
              />
            </Box>
          );
        }
        if (col.field === 'title' && isModerationPage) {
          return (
            <Typography sx={stylesListTableTextColor} variant='body1'>
              {row[col.field]}
            </Typography>
          );
        }
        if (['title', 'product', 'fullName'].includes(col.field)) {
          return (
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
          );
        }
        return (
          <Typography sx={stylesListTableTextColor} variant='body1'>
            {row[col.field]}
          </Typography>
        );
      })()}
    </TableCell>
  );
}

export default EntityTableCell;
