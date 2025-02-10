import { useMemo } from 'react';

import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Task';

import useAuthUser from '../../hooks/useAuthUser';

import { stylesListTableActions } from '../../styles';

function ActionButtons({ row, linkEntity, onEdit, onRemove, onModerate }) {
  const { authenticatedUser } = useAuthUser();

  const hasPermission = useMemo(() => {
    if (!authenticatedUser?.permissions) {
      return () => false;
    }
    const permissionsSet = new Set(
      authenticatedUser.permissions.map((p) => p.title)
    );
    return (permission) => permissionsSet.has(permission);
  }, [authenticatedUser?.permissions]);

  if (linkEntity === 'moderation') {
    const canModerate =
      hasPermission('MODERATION_ESTABLISHMENTS') ||
      hasPermission('MODERATION_PRODUCTS') ||
      hasPermission('MODERATION_CATEGORIES');

    return (
      <TableCell align='center' sx={stylesListTableActions}>
        <Tooltip title='Модерувати'>
          <IconButton disabled={!canModerate} onClick={() => onModerate(row)}>
            <TaskIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    );
  }

  if (linkEntity === 'categories') {
    const canManageCategories = hasPermission('MANAGE_CATEGORIES');

    return (
      <>
        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Редагувати'>
            <IconButton
              disabled={!canManageCategories}
              onClick={() => onEdit(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Видалити'>
            <IconButton
              disabled={!canManageCategories}
              onClick={() => onRemove(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }

  if (linkEntity === 'establishments') {
    const canManageEstablishments = hasPermission('MANAGE_ESTABLISHMENTS');

    return (
      <>
        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Редагувати'>
            <IconButton
              disabled={!canManageEstablishments}
              onClick={() => onEdit(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Видалити'>
            <IconButton
              disabled={!canManageEstablishments}
              onClick={() => onRemove(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }

  if (linkEntity === 'products') {
    const canManageProducts = hasPermission('MANAGE_PRODUCTS');

    return (
      <>
        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Редагувати'>
            <IconButton
              disabled={!canManageProducts}
              onClick={() => onEdit(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Видалити'>
            <IconButton
              disabled={!canManageProducts}
              onClick={() => onRemove(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }

  if (linkEntity === 'currencies') {
    const canManageCurrencies = hasPermission('MANAGE_CURRENCIES');

    return (
      <>
        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Редагувати'>
            <IconButton
              disabled={!canManageCurrencies}
              onClick={() => onEdit(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Видалити'>
            <IconButton
              disabled={!canManageCurrencies}
              onClick={() => onRemove(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }

  if (linkEntity === 'measures') {
    const canManageMeasures = hasPermission('MANAGE_MEASURES');

    return (
      <>
        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Редагувати'>
            <IconButton
              disabled={!canManageMeasures}
              onClick={() => onEdit(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Видалити'>
            <IconButton
              disabled={!canManageMeasures}
              onClick={() => onRemove(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }

  if (linkEntity === 'users') {
    const canManageUsers = hasPermission('MANAGE_USERS');

    return (
      <>
        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Редагувати'>
            <IconButton disabled={!canManageUsers} onClick={() => onEdit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Видалити'>
            <IconButton
              disabled={!canManageUsers}
              onClick={() => onRemove(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }

  if (linkEntity === 'roles') {
    const canManageRoles = hasPermission('MANAGE_ROLES');

    return (
      <>
        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Редагувати'>
            <IconButton disabled={!canManageRoles} onClick={() => onEdit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActions}>
          <Tooltip title='Видалити'>
            <IconButton
              disabled={!canManageRoles}
              onClick={() => onRemove(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }

  return (
    <>
      <TableCell align='center' sx={stylesListTableActions}>
        <Tooltip title='Редагувати'>
          <IconButton onClick={() => onEdit(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </TableCell>

      <TableCell align='center' sx={stylesListTableActions}>
        <Tooltip title='Видалити'>
          <IconButton onClick={() => onRemove(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );
}

export default ActionButtons;
