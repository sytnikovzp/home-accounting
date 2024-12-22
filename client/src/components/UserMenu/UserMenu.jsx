import { ListItemIcon, MenuItem } from '@mui/material';

function UserMenu({
  menuItems,
  currentUser,
  navigateTo,
  closeMenu,
  handleLogout,
}) {
  const handleMenuItemClick = (action, isLogout) => {
    if (isLogout) {
      handleLogout();
      closeMenu();
    } else if (typeof action === 'function') {
      navigateTo(action(currentUser));
      closeMenu();
    } else {
      navigateTo(currentUser[action]);
      closeMenu();
    }
  };

  return (
    <>
      {menuItems.map(({ label, icon, action, isLogout }, index) => (
        <MenuItem
          key={index}
          onClick={() => handleMenuItemClick(action, isLogout)}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {label}
        </MenuItem>
      ))}
    </>
  );
}

export default UserMenu;
