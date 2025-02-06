import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { stylesListTableFormControl } from '../../styles';

function StatusDropdown({
  expensesPage,
  selectedStatus,
  usersPage,
  onPageChange,
  onStatusChange,
}) {
  let statusOptions = [];
  if (usersPage) {
    statusOptions = [
      { label: 'Всі користувачі', value: 'all' },
      { label: 'Очікують веріфікації', value: 'pending' },
      { label: 'Веріфіковані', value: 'verified' },
    ];
  } else if (expensesPage) {
    statusOptions = [
      { label: 'За останній день', value: 'day' },
      { label: 'За останній тиждень', value: 'week' },
      { label: 'За останній місяць', value: 'month' },
      { label: 'За останній рік', value: 'year' },
      { label: 'За весь час', value: 'allTime' },
    ];
  } else {
    statusOptions = [
      { label: 'Очікує модерації', value: 'pending' },
      { label: 'Затверджено', value: 'approved' },
      { label: 'Відхилено', value: 'rejected' },
    ];
  }

  return (
    <FormControl sx={stylesListTableFormControl}>
      <InputLabel id='status-select-label'>Статус</InputLabel>
      <Select
        label='Статус'
        labelId='status-select-label'
        size='small'
        value={selectedStatus}
        onChange={(e) => {
          onStatusChange(e);
          onPageChange(1);
        }}
      >
        {statusOptions.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default StatusDropdown;
