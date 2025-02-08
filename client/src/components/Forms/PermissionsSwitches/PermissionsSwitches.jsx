import { useCallback, useMemo } from 'react';
import { FieldArray, useFormikContext } from 'formik';

import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import {
  stylesPermissionsSwitchesFontDescription,
  stylesPermissionsSwitchesFontTitle,
  stylesPermissionsSwitchesListItem,
  stylesPermissionsSwitchesMainBox,
} from '../../../styles';

function PermissionsSwitches({ permissionsList }) {
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

  return (
    <Box sx={stylesPermissionsSwitchesMainBox}>
      <Typography gutterBottom variant='h6'>
        Дозволи (Permissions):
      </Typography>
      <FieldArray
        name='permissions'
        render={(arrayHelpers) => (
          <List>
            {permissionsList.map(({ uuid, title, description }) => (
              <ListItem
                key={uuid}
                disableGutters
                sx={stylesPermissionsSwitchesListItem}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isCheckedPermissions.has(uuid)}
                      onChange={handleToggle(uuid, arrayHelpers)}
                    />
                  }
                  label={
                    <>
                      <Typography
                        sx={stylesPermissionsSwitchesFontTitle}
                        variant='body1'
                      >
                        {title}
                      </Typography>
                      <Typography
                        sx={stylesPermissionsSwitchesFontDescription}
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
        )}
      />
    </Box>
  );
}

export default PermissionsSwitches;
