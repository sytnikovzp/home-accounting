import { useCallback, useMemo } from 'react';
import { FieldArray, useFormikContext } from 'formik';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import {
  stylesPermissionsSelectorCheckboxSize,
  stylesPermissionsSelectorFontDescription,
  stylesPermissionsSelectorFontTitle,
  stylesPermissionsSelectorListItem,
  stylesPermissionsSelectorMainBox,
} from '@/src/styles';

function PermissionsSelector({ permissionsList }) {
  const { values } = useFormikContext();
  const selectedPermissions = values.permissions;

  const isCheckedPermissions = useMemo(
    () => new Set(selectedPermissions),
    [selectedPermissions]
  );

  const handleToggle = useCallback(
    (uuid, arrayHelpers) => (event) => {
      if (event.target.checked) {
        arrayHelpers.push(uuid);
      } else {
        const index = selectedPermissions.indexOf(uuid);
        if (index !== -1) {
          arrayHelpers.remove(index);
        }
      }
    },
    [selectedPermissions]
  );

  const renderPermissionsList = useCallback(
    (arrayHelpers) => (
      <List>
        {permissionsList.map(({ uuid, title, description }) => (
          <ListItem
            key={uuid}
            disableGutters
            sx={stylesPermissionsSelectorListItem}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCheckedPermissions.has(uuid)}
                  sx={stylesPermissionsSelectorCheckboxSize}
                  onChange={handleToggle(uuid, arrayHelpers)}
                />
              }
              label={
                <>
                  <Typography
                    sx={stylesPermissionsSelectorFontTitle}
                    variant='body1'
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={stylesPermissionsSelectorFontDescription}
                    variant='body2'
                  >
                    {description || '*Немає даних*'}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    ),
    [handleToggle, isCheckedPermissions, permissionsList]
  );

  return (
    <Box sx={stylesPermissionsSelectorMainBox}>
      <FieldArray name='permissions' render={renderPermissionsList} />
    </Box>
  );
}

export default PermissionsSelector;
