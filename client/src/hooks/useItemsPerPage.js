import useMediaQuery from '@mui/material/useMediaQuery';

function useItemsPerPage() {
  const isXs = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const isSm = useMediaQuery((theme) => theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery((theme) => theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery((theme) => theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery((theme) => theme.breakpoints.up('xl'));

  const breakpoints = [
    { items: 6, match: isXs },
    { items: 6, match: isSm },
    { items: 7, match: isMd },
    { items: 8, match: isLg },
    { items: 13, match: isXl },
  ];

  const matchedBreakpoint = breakpoints.find((bp) => bp.match);
  return matchedBreakpoint ? matchedBreakpoint.items : 6;
}

export default useItemsPerPage;
