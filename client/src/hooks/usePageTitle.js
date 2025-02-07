import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { uuidPattern } from '../utils/sharedFunctions';

function usePageTitle(pageTitles, authMode, titleOverride = null) {
  const location = useLocation();

  const title = useMemo(() => {
    if (titleOverride) {
      return titleOverride;
    }
    if (authMode && pageTitles[authMode]) {
      return pageTitles[authMode];
    }
    if (location.pathname === '/') {
      return pageTitles.default;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const action = pathSegments.length > 1 ? pathSegments[1] : null;
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (pageTitles[action]) {
      return pageTitles[action];
    }
    if (uuidPattern.test(lastSegment)) {
      return pageTitles.view;
    }

    return pageTitles.default;
  }, [authMode, location.pathname, pageTitles, titleOverride]);

  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default usePageTitle;
