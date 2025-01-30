import { Cancel, CheckCircle, HourglassEmpty } from '@mui/icons-material';

function StatusIcon({ status }) {
  const icons = {
    Затверджено: <CheckCircle color='success' />,
    Веріфікований: <CheckCircle color='success' />,
    'Очікує модерації': <HourglassEmpty color='warning' />,
    'Очікує веріфікації': <HourglassEmpty color='warning' />,
  };

  return icons[status] || <Cancel color='error' />;
}

export default StatusIcon;
