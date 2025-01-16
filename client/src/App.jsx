import { useCallback, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { getAccessToken } from './utils/sharedFunctions';
import restController from './api/rest/restController';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleCloseAuthModal = () => setAuthModalOpen(false);

  const checkAuthentication = useCallback(async () => {
    try {
      const currentUser = await restController.fetchUserProfile();
      setCurrentUser(currentUser);
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
      <ModalWindow
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
    <HelmetProvider>
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
              element={renderPrivateRoute(<ModerationsPage />)}
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
            <Route element={<NotificationsPage />} path='notification' />
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
    </HelmetProvider>
  );
}

export default App;
