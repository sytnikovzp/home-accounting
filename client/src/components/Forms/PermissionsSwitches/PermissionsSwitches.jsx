import { FieldArray, useFormikContext } from 'formik';
import {
  Box,
  FormControlLabel,
  List,
  ListItem,
  Switch,
  Typography,
} from '@mui/material';

import {
  stylesPermissionsSwitchesFontDescription,
  stylesPermissionsSwitchesFontTitle,
  stylesPermissionsSwitchesListItem,
  stylesPermissionsSwitchesMainBox,
} from '../../../styles';

function PermissionsSwitches({ permissionsList }) {
  const { values } = useFormikContext();
  return (
    <Box sx={stylesPermissionsSwitchesMainBox}>
      <Typography gutterBottom variant='h6'>
        Дозволи (Permissions):
      </Typography>
      <FieldArray
        name='permissions'
        render={(arrayHelpers) => (
          <List>
            {permissionsList.map((permission) => {
              const isChecked = values.permissions.includes(permission.uuid);
              return (
                <ListItem
                  key={permission.uuid}
                  disableGutters
                  sx={stylesPermissionsSwitchesListItem}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isChecked}
                        onChange={(event) => {
                          if (event.target.checked) {
                            arrayHelpers.push(permission.uuid);
                          } else {
                            const index = values.permissions.indexOf(
                              permission.uuid
                            );
                            arrayHelpers.remove(index);
                          }
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography
                          sx={stylesPermissionsSwitchesFontTitle}
                          variant='body1'
                        >
                          {permission.title}
                        </Typography>
                        <Typography
                          sx={stylesPermissionsSwitchesFontDescription}
                          variant='body2'
                        >
                          {permission.description || '*Опис відсутній*'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      />
    </Box>
  );
}

export default PermissionsSwitches;
