/* eslint-disable prefer-destructuring */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { uuidPattern } from '../utils/sharedFunctions';

function usePageTitle(pageTitles, authMode, titleOverride = null) {
  const location = useLocation();

  useEffect(() => {
    let title = titleOverride || pageTitles.default;

    if (!titleOverride) {
      if (authMode && pageTitles[authMode]) {
        title = pageTitles[authMode];
      } else if (location.pathname === '/') {
        title = pageTitles.default;
      } else {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        const action = pathSegments[1];
        const lastSegment = pathSegments[pathSegments.length - 1];

        if (pageTitles[action]) {
          title = pageTitles[action];
        } else if (uuidPattern.test(lastSegment)) {
          title = pageTitles.view;
        }
      }
    }

    document.title = title;
  }, [authMode, location.pathname, pageTitles, titleOverride]);
}

export default usePageTitle;
