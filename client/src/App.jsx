import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// ==============================================================
import restController from './api/rest/restController';
import { getAccessToken } from './utils/sharedFunctions';
// ==============================================================
import CustomModal from './components/CustomModal/CustomModal';
import Preloader from './components/Preloader/Preloader';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthPage from './pages/AuthPage/AuthPage';
import HomePage from './pages/HomePage/HomePage';
import ExpensesPage from './pages/Expenses/ExpensesPage';
import EstablishmentsPage from './pages/Establishments/EstablishmentsPage';
import ProductsPage from './pages/Products/ProductsPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import CurrenciesPage from './pages/Currencies/CurrenciesPage';
import MeasuresPage from './pages/Measures/MeasuresPage';
import ModerationPage from './pages/Moderation/ModerationPage';
import UsersPage from './pages/Users/UsersPage';
import RolesPage from './pages/Roles/RolesPage';
import UserResetPasswordPage from './pages/Users/UserResetPasswordPage';
import NotificationPage from './pages/NotificationPage/NotificationPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setUserProfile] = useState(null);

  const handleCloseAuthModal = () => setAuthModalOpen(false);

  const checkAuthentication = async () => {
    try {
      const currentUser = await restController.fetchUserProfile();
      setUserProfile(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Не вдалося завантажити дані користувача:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      checkAuthentication();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <CustomModal
        isOpen={true}
        onClose={null}
        content={<Preloader message='Welcome to Home Accounting...' />}
        disableBackdropClick={true}
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
          path='/'
          element={
            <Layout
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              setIsAuthenticated={setIsAuthenticated}
              setAuthModalOpen={setAuthModalOpen}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route
            path='expenses/*'
            element={renderPrivateRoute(<ExpensesPage />)}
          />
          <Route 
            path='establishments/*' 
            element={renderPrivateRoute(<EstablishmentsPage />)} 
          />
          <Route
            path='products/*'
            element={renderPrivateRoute(<ProductsPage />)}
          />
          <Route
            path='categories/*'
            element={renderPrivateRoute(<CategoriesPage />)}
          />
          <Route
            path='currencies/*'
            element={renderPrivateRoute(<CurrenciesPage />)}
          />
          <Route
            path='measures/*'
            element={renderPrivateRoute(<MeasuresPage />)}
          />
          <Route
            path='moderation/*'
            element={renderPrivateRoute(<ModerationPage />)}
          />
          <Route 
            path='users/*' 
            element={renderPrivateRoute(<UsersPage />)} 
          />
          <Route 
            path='roles/*' 
            element={renderPrivateRoute(<RolesPage />)} 
          />
          <Route 
            path='notification' 
            element={<NotificationPage />} 
          />
          <Route 
            path='reset-password' 
            element={<UserResetPasswordPage />} 
          />
          <Route 
            path='*' 
            element={<Navigate to='/' replace />} 
          />
        </Route>
      </Routes>

      {isAuthModalOpen && !isAuthenticated && (
        <AuthPage
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
          checkAuthentication={checkAuthentication}
        />
      )}
    </Router>
  );
}

export default App;
