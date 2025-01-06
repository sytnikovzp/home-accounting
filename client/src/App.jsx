import { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { getAccessToken } from './utils/sharedFunctions';
import restController from './api/rest/restController';

import CustomModal from './components/CustomModal/CustomModal';
import Layout from './components/Layout/Layout';
import Preloader from './components/Preloader/Preloader';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import AuthPage from './pages/AuthPage/AuthPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import CurrenciesPage from './pages/Currencies/CurrenciesPage';
import EstablishmentsPage from './pages/Establishments/EstablishmentsPage';
import ExpensesPage from './pages/Expenses/ExpensesPage';
import HomePage from './pages/HomePage/HomePage';
import MeasuresPage from './pages/Measures/MeasuresPage';
import ModerationPage from './pages/Moderation/ModerationPage';
import NotificationPage from './pages/NotificationPage/NotificationPage';
import ProductsPage from './pages/Products/ProductsPage';
import RolesPage from './pages/Roles/RolesPage';
import UserResetPasswordPage from './pages/Users/UserResetPasswordPage';
import UsersPage from './pages/Users/UsersPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setUserProfile] = useState(null);

  const handleCloseAuthModal = () => setAuthModalOpen(false);

  const checkAuthentication = useCallback(async () => {
    try {
      const currentUser = await restController.fetchUserProfile();
      setUserProfile(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Не вдалося завантажити дані користувача:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      checkAuthentication();
    } else {
      setIsLoading(false);
    }
  }, [checkAuthentication]);

  if (isLoading) {
    return (
      <CustomModal
        content={<Preloader message='Welcome to Home Accounting...' />}
        disableBackdropClick={true}
        isOpen={true}
        onClose={null}
      />
    );
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
    <Router>
      <Routes>
        <Route
          element={
            <Layout
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
              setAuthModalOpen={setAuthModalOpen}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
          path='/'
        >
          <Route index element={<HomePage currentUser={currentUser} />} />
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
            element={renderPrivateRoute(<ModerationPage />)}
            path='moderation/*'
          />
          <Route
            element={renderPrivateRoute(
              <UsersPage
                currentUser={currentUser}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
            path='users/*'
          />
          <Route element={renderPrivateRoute(<RolesPage />)} path='roles/*' />
          <Route element={<NotificationPage />} path='notification' />
          <Route element={<UserResetPasswordPage />} path='reset-password' />
          <Route element={<Navigate replace to='/' />} path='*' />
        </Route>
      </Routes>

      {isAuthModalOpen && !isAuthenticated && (
        <AuthPage
          checkAuthentication={checkAuthentication}
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
        />
      )}
    </Router>
  );
}

export default App;
