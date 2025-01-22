import { useCallback } from 'react';

import UserMenuItem from './UserMenuItem';

function UserMenu({
  closeUserMenu,
  currentUser,
  handleLogout,
  menuItems,
  navigateTo,
}) {
  const handleMenuItemClick = useCallback(
    (action, isLogout) => {
      if (isLogout) {
        handleLogout();
      } else if (typeof action === 'function') {
        navigateTo(action(currentUser));
      } else {
        navigateTo(currentUser[action]);
      }
      closeUserMenu();
    },
    [handleLogout, navigateTo, closeUserMenu, currentUser]
  );

  return (
    <>
      {menuItems.map((item, index) => (
        <UserMenuItem
          key={index}
          {...item}
          currentUser={currentUser}
          onAction={handleMenuItemClick}
        />
      ))}
    </>
  );
}

export default UserMenu;
