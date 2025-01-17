import { Route, Routes } from 'react-router-dom';

function EntityRoutes({ entityPages, fetchEntities, handleModalClose }) {
  return (
    <Routes>
      {entityPages.map(({ path, Component, fetchMethod }) => (
        <Route
          key={path}
          element={
            <Component
              fetchEntities={fetchMethod || fetchEntities}
              handleModalClose={handleModalClose}
            />
          }
          path={path}
        />
      ))}
    </Routes>
  );
}

export default EntityRoutes;
