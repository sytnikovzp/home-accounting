import { Cancel, CheckCircle, HourglassEmpty } from '@mui/icons-material';

function StatusIcon({ status }) {
  const icons = {
    Веріфікований: <CheckCircle color='success' />,
    Затверджено: <CheckCircle color='success' />,
    'Очікує веріфікації': <HourglassEmpty color='warning' />,
    'Очікує модерації': <HourglassEmpty color='warning' />,
  };

  return icons[status] || <Cancel color='error' />;
}

export default StatusIcon;
