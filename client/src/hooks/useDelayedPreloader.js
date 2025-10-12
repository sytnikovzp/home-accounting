import { useEffect, useState } from 'react';

import { APP_SETTINGS } from '@/src/constants';

function useDelayedPreloader(isLoading) {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(false);

  useEffect(() => {
    let showTimeout = null;
    let hideTimeout = null;

    if (isLoading) {
      showTimeout = setTimeout(
        () => setIsPreloaderVisible(true),
        APP_SETTINGS.DELAY_VISIBLE_PRELOADER
      );
    } else {
      hideTimeout = setTimeout(() => setIsPreloaderVisible(false), 0);
    }

    return () => {
      if (showTimeout) {
        clearTimeout(showTimeout);
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [isLoading]);

  return isPreloaderVisible;
}

export default useDelayedPreloader;
