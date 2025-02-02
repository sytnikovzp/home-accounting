import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import { selectIsAuthenticated } from '../../store/selectors/authSelectors';

function PrivateRoute({ children }) {
  // const isAuthenticated = useSelector(selectIsAuthenticated);

  // if (!isAuthenticated) {
  //   return <Navigate replace to='/auth' />;
  // }

  return children;
}

export default PrivateRoute;
