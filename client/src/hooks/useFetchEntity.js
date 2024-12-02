import { useState, useCallback } from 'react';
// ==============================================================
import restController from '../api/rest/restController';

function useFetchEntity(entityType) {
  const [entity, setEntity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchEntityById = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const response = await restController[`fetch${entityType}ById`](id);
        setEntity(response);
      } catch (error) {
        console.log(error);
        setErrorMessage(
          error.response?.data?.errors?.[0]?.title ||
            'Помилка завантаження даних'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  return { entity, isLoading, errorMessage, fetchEntityById };
}

export default useFetchEntity;
