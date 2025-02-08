import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { statusOptions } from '../../constants';

import { stylesListTableFormControl } from '../../styles';

const { STATUS_OPTIONS } = statusOptions;

function StatusDropdown({
  linkEntity,
  selectedStatus,
  onPageChange,
  onStatusChange,
}) {
  const statusOptions = STATUS_OPTIONS[linkEntity] ?? STATUS_OPTIONS.default;

  const handleStatusChange = (event) => {
    // onStatusChange(event.target.value);
    onStatusChange(event);
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
