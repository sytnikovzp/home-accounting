import { useMemo } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { stylesListTableFormControl } from '../../styles';

function StatusDropdown({
  linkEntity,
  selectedStatus,
  onPageChange,
  onStatusChange,
}) {
  const statusOptions = useMemo(() => {
    if (linkEntity === 'users') {
      return [
        { label: 'Всі користувачі', value: 'all' },
        { label: 'Очікують веріфікації', value: 'pending' },
        { label: 'Веріфіковані', value: 'verified' },
      ];
    }
    if (linkEntity === 'expenses') {
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
  }, [linkEntity]);

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
