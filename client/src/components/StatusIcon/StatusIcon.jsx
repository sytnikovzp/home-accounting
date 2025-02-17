import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

function StatusIcon({ status }) {
  const icons = {
    Підтверджений: <CheckCircleIcon color='success' />,
    Затверджено: <CheckCircleIcon color='success' />,
    'Очікує підтвердження': <HourglassEmptyIcon color='warning' />,
    'Очікує модерації': <HourglassEmptyIcon color='warning' />,
  };

  return icons[status] || <CancelIcon color='error' />;
}

export default StatusIcon;
