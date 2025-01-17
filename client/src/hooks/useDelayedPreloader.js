import { useEffect, useState } from 'react';

import { DELAY_SHOW_PRELOADER } from '../constants';

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
