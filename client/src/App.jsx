/* eslint-disable camelcase */
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
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthPage from './pages/AuthPage/AuthPage';
import HomePage from './pages/HomePage/HomePage';
import PurchasesPage from './pages/PurchasesPage/PurchasesPage';
import ShopsPage from './pages/ShopsPage/ShopsPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
import CurrenciesPage from './pages/CurrenciesPage/CurrenciesPage';
import MeasuresPage from './pages/MeasuresPage/MeasuresPage';
import ModerationPage from './pages/ModerationPage/ModerationPage';
import UsersPage from './pages/UsersPage/UsersPage';
import RolesPage from './pages/RolesPage/RolesPage';

const App = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleCloseAuthModal = () => setAuthModalOpen(false);

  const checkAuthentication = async () => {
    const token = getAccessToken();
    if (token) {
      try {
        const userProfile = await restController.fetchUserProfile();
        setUserProfile(userProfile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Не вдалося завантажити дані користувача:', error.message);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const renderPrivateRoute = (Component) => (
    <PrivateRoute
      isAuthenticated={isAuthenticated}
      setAuthModalOpen={setAuthModalOpen}
    >
      {Component}
    </PrivateRoute>
  );

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route
          path='/'
          element={
            <Layout
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              setIsAuthenticated={setIsAuthenticated}
              setAuthModalOpen={setAuthModalOpen}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route
            path='purchases/*'
            element={renderPrivateRoute(<PurchasesPage />)}
          />
          <Route 
            path='shops/*' 
            element={renderPrivateRoute(<ShopsPage />)} 
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
            path='auth/*'
            element={
              isAuthenticated ? (
                <Navigate to='/' replace />
              ) : (
                <AuthPage
                  isOpen={isAuthModalOpen}
                  onClose={handleCloseAuthModal}
                  checkAuthentication={checkAuthentication}
                />
              )
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
