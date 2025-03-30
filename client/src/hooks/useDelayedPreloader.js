import { useEffect, useState } from 'react';

import { APP_SETTINGS } from '../constants';

function useDelayedPreloader(isLoading) {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(false);

  useEffect(() => {
    let timeout = null;

    if (isLoading) {
      timeout = setTimeout(
        () => setIsPreloaderVisible(true),
        APP_SETTINGS.DELAY_VISIBLE_PRELOADER
      );
    } else {
      setIsPreloaderVisible(false);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return isPreloaderVisible;
}

export default useDelayedPreloader;
