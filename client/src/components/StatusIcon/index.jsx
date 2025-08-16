import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const statusIcons = {
  Підтверджений: { icon: CheckCircleIcon, color: 'success' },
  Затверджено: { icon: CheckCircleIcon, color: 'success' },
  'Очікує підтвердження': { icon: HourglassEmptyIcon, color: 'warning' },
  'Очікує модерації': { icon: HourglassEmptyIcon, color: 'warning' },
};

function StatusIcon({ status }) {
  const { icon: Icon = CancelIcon, color = 'error' } =
    statusIcons[status] || {};
  return <Icon color={color} />;
}

export default StatusIcon;
