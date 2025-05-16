export const stylesAuthenticatedUserBlockBox = {
  display: 'flex',
  alignItems: 'center',
};

export const stylesAuthenticatedUserBlockMenu = {
  overflow: 'visible',
  mt: 1.5,
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  '&:before': {
    position: 'absolute',
    top: 0,
    right: { xs: 22, sm: 25 },
    zIndex: 0,
    display: 'block',
    width: 10,
    height: 10,
    bgcolor: 'background.paper',
    content: '""',
    transform: 'translateY(-50%) rotate(45deg)',
  },
};

export const stylesAuthenticatedUserBlockMenuAnchor = {
  horizontal: 'right',
  vertical: 'bottom',
};

export const stylesAuthenticatedUserBlockMenuTransform = {
  horizontal: 'right',
  vertical: 'top',
};

export const stylesAuthenticatedUserBlockIconButton = {
  ml: 2,
};
