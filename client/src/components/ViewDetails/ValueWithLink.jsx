import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

function ValueWithLink({ value, isLink, linkTo = '' }) {
  const isExternalLink =
    linkTo && (linkTo.startsWith('http://') || linkTo.startsWith('https://'));

  if (isLink && linkTo) {
    return isExternalLink ? (
      <Link
        color='primary'
        href={linkTo}
        rel='noopener noreferrer'
        target='_blank'
        underline='hover'
      >
        {value}
      </Link>
    ) : (
      <Link
        color='primary'
        component={RouterLink}
        to={linkTo}
        underline='hover'
      >
        {value}
      </Link>
    );
  }
  return value || '*Немає даних*';
}

export default ValueWithLink;
