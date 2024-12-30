import { useMediaQuery } from '@mui/material';

const useItemsPerPage = () => {
  const isXs = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const isSm = useMediaQuery((theme) => theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery((theme) => theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery((theme) => theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery((theme) => theme.breakpoints.up('xl'));

  if (isXs) return 6;
  if (isSm) return 7;
  if (isMd) return 8;
  if (isLg) return 8;
  if (isXl) return 12;
  return 6;
};

export default useItemsPerPage;
