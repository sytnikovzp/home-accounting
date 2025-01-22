import { useEffect } from 'react';

import { uuidPattern } from '../utils/sharedFunctions';

function usePageTitle(location, pageTitles, authMode) {
  useEffect(() => {
    let title = null;
    if (authMode && pageTitles[authMode]) {
      title = pageTitles[authMode];
    } else if (
      uuidPattern.test(location.pathname) &&
      !location.pathname.includes('password') &&
      !location.pathname.includes('edit') &&
      !location.pathname.includes('remove')
    ) {
      title = pageTitles.view;
    } else {
      const pathKey = Object.keys(pageTitles).find((key) =>
        location.pathname.includes(key)
      );
      title = pageTitles[pathKey] || pageTitles.default;
    }
    document.title = title;
  }, [authMode, location.pathname, pageTitles]);
}

export default usePageTitle;
