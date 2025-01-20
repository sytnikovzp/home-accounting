import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectProfile,
  selectProfileError,
  selectProfileIsLoading,
} from './store/selectors/profileSelectors';
import { fetchUserProfile } from './store/thunks/profileThunks';

import Error from './components/Error/Error';
import Layout from './components/Layout/Layout';
import ModalWindow from './components/ModalWindow/ModalWindow';
import Preloader from './components/Preloader/Preloader';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import AuthPage from './pages/AuthPage/AuthPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import CurrenciesPage from './pages/Currencies/CurrenciesPage';
import EstablishmentsPage from './pages/Establishments/EstablishmentsPage';
import ExpensesPage from './pages/Expenses/ExpensesPage';
import HomePage from './pages/HomePage/HomePage';
import MeasuresPage from './pages/Measures/MeasuresPage';
import ModerationsPage from './pages/Moderations/ModerationsPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ProductsPage from './pages/Products/ProductsPage';
import RolesPage from './pages/Roles/RolesPage';
import UserResetPasswordPage from './pages/Users/UserResetPasswordPage';
import UsersPage from './pages/Users/UsersPage';

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const dispatch = useDispatch();

  const currentUser = useSelector(selectProfile);
  const isLoading = useSelector(selectProfileIsLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const isAuthenticated = Boolean(currentUser);
  const handleCloseAuthModal = () => setAuthModalOpen(false);

  if (isLoading) {
    return (
      <ModalWindow
        disableBackdropClick
        isOpen
        content={<Preloader message='Welcome to Home Accounting...' />}
      />
    );
  }

  if (error && !isAuthenticated) {
    return <Error error={error} />;
  }

  const renderPrivateRoute = (Component) => (
    <PrivateRoute
      isAuthenticated={isAuthenticated}
      setAuthModalOpen={setAuthModalOpen}
    >
      {Component}
    </PrivateRoute>
  );

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route
            element={<Layout setAuthModalOpen={setAuthModalOpen} />}
            path='/'
          >
            <Route index element={<HomePage />} />
            <Route
              element={renderPrivateRoute(<ExpensesPage />)}
              path='expenses/*'
            />
            <Route
              element={renderPrivateRoute(<EstablishmentsPage />)}
              path='establishments/*'
            />
            <Route
              element={renderPrivateRoute(<ProductsPage />)}
              path='products/*'
            />
            <Route
              element={renderPrivateRoute(<CategoriesPage />)}
              path='categories/*'
            />
            <Route
              element={renderPrivateRoute(<CurrenciesPage />)}
              path='currencies/*'
            />
            <Route
              element={renderPrivateRoute(<MeasuresPage />)}
              path='measures/*'
            />
            <Route
              element={renderPrivateRoute(<ModerationsPage />)}
              path='moderation/*'
            />
            <Route element={renderPrivateRoute(<UsersPage />)} path='users/*' />
            <Route element={renderPrivateRoute(<RolesPage />)} path='roles/*' />
            <Route element={<NotificationsPage />} path='notification' />
            <Route element={<UserResetPasswordPage />} path='reset-password' />
            <Route element={<Navigate replace to='/' />} path='*' />
          </Route>
        </Routes>

        {isAuthModalOpen && !isAuthenticated && (
          <AuthPage isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
        )}
      </Router>
    </HelmetProvider>
  );
}

export default App;
