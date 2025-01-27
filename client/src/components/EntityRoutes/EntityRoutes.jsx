import { Route, Routes } from 'react-router-dom';

function EntityRoutes({ entityPages, handleModalClose }) {
  return (
    <Routes>
      {entityPages.map(({ path, Component }) => (
        <Route
          key={path}
          element={<Component handleModalClose={handleModalClose} />}
          path={path}
        />
      ))}
    </Routes>
  );
}

export default EntityRoutes;
