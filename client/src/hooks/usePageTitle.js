import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const uuidPattern = /[\dA-Fa-f-]{36}/;

function usePageTitle(pageTitles) {
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname === '/') {
      return pageTitles.get('default');
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const action = pathSegments.length > 1 ? pathSegments[1] : null;
    const lastSegment = pathSegments.at(-1);

    if (pageTitles.has(action)) {
      return pageTitles.get(action);
    }
    if (uuidPattern.test(lastSegment)) {
      return pageTitles.get('view');
    }

    return pageTitles.get('default');
  }, [location.pathname, pageTitles]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return title;
}

export default usePageTitle;
