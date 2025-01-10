import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

function UserLink({ userFullName, userUuid }) {
  return userFullName ? (
    <Link
      color='primary'
      component={RouterLink}
      to={`/users/${userUuid}`}
      underline='hover'
    >
      {userFullName}
    </Link>
  ) : (
    <span>*Немає даних*</span>
  );
}

export default UserLink;
