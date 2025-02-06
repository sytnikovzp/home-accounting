import { useMemo } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { stylesListTableFormControl } from '../../styles';

function StatusDropdown({
  expensesPage,
  selectedStatus,
  usersPage,
  onPageChange,
  onStatusChange,
}) {
  const statusOptions = useMemo(() => {
    if (usersPage) {
      return [
        { label: 'Всі користувачі', value: 'all' },
        { label: 'Очікують веріфікації', value: 'pending' },
        { label: 'Веріфіковані', value: 'verified' },
      ];
    }
    if (expensesPage) {
      return [
        { label: 'За останній день', value: 'day' },
        { label: 'За останній тиждень', value: 'week' },
        { label: 'За останній місяць', value: 'month' },
        { label: 'За останній рік', value: 'year' },
        { label: 'За весь час', value: 'allTime' },
      ];
    }
    return [
      { label: 'Очікує модерації', value: 'pending' },
      { label: 'Затверджено', value: 'approved' },
      { label: 'Відхилено', value: 'rejected' },
    ];
  }, [usersPage, expensesPage]);

  const handleStatusChange = (e) => {
    onStatusChange(e);
    onPageChange(1);
  };

  return (
    <FormControl sx={stylesListTableFormControl}>
      <InputLabel id='status-select-label'>Статус</InputLabel>
      <Select
        label='Статус'
        labelId='status-select-label'
        size='small'
        value={selectedStatus}
        onChange={handleStatusChange}
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
