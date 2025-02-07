import { useEffect, useState } from 'react';

import { configs } from '../constants';

const { DELAY_VISIBLE_PRELOADER } = configs;

function useDelayedPreloader(isLoading) {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(false);

  useEffect(() => {
    let timeout = null;

    if (isLoading) {
      timeout = setTimeout(
        () => setIsPreloaderVisible(true),
        DELAY_VISIBLE_PRELOADER
      );
    } else {
      setIsPreloaderVisible(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return isPreloaderVisible;
}

export default useDelayedPreloader;
