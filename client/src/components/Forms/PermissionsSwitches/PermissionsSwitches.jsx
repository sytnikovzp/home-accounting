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
      <Typography variant='h6' gutterBottom>
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
                          variant='body1'
                          sx={stylesPermissionsSwitchesFontTitle}
                        >
                          {permission.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={stylesPermissionsSwitchesFontDescription}
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
