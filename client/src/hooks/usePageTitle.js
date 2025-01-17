import { useEffect } from 'react';

import { uuidPattern } from '../utils/sharedFunctions';

function usePageTitle(location, pageTitles) {
  useEffect(() => {
    const pathKey = Object.keys(pageTitles).find((key) =>
      location.pathname.includes(key)
    );
    const isUuid = uuidPattern.test(location.pathname);
    const isPasswordOrEditOrDelete =
      location.pathname.includes('password') ||
      location.pathname.includes('edit') ||
      location.pathname.includes('delete');
    document.title =
      isUuid && !isPasswordOrEditOrDelete
        ? pageTitles.view
        : pageTitles[pathKey] || pageTitles.default;
  }, [location, pageTitles]);
}

export default usePageTitle;
