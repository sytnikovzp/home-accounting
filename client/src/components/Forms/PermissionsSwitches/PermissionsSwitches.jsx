import { FieldArray, useFormikContext } from 'formik';
import {
  Box,
  FormControlLabel,
  List,
  ListItem,
  Switch,
  Typography,
} from '@mui/material';

function PermissionsSwitches({ permissionsList }) {
  const { values } = useFormikContext();
  return (
    <Box
      sx={{
        maxHeight: '250px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}
    >
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
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    ml: 1,
                    borderBottom: '1px solid #ddd',
                  }}
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
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          {permission.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ color: 'text.secondary' }}
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
