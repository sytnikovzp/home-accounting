import { useCallback, useState } from 'react';

import restController from '../api/rest/restController';

function useFetchEntity(entityType) {
  const [entity, setEntity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntityByUuid = useCallback(
    async (uuid) => {
      setIsLoading(true);
      try {
        const response = await restController[`fetch${entityType}ByUuid`](uuid);
        setEntity(response);
      } catch (error) {
        setError(error.response.data);
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  return { entity, error, fetchEntityByUuid, isLoading };
}

export default useFetchEntity;
