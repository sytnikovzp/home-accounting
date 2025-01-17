import { useEffect, useState } from 'react';

import { configs } from '../constants';

const { DELAY_SHOW_PRELOADER } = configs;

function useDelayedPreloader(isLoading) {
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    let timeout = null;
    if (isLoading) {
      timeout = setTimeout(() => setShowPreloader(true), DELAY_SHOW_PRELOADER);
    } else {
      setShowPreloader(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return showPreloader;
}

export default useDelayedPreloader;
