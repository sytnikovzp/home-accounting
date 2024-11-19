/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// ==============================================================
import { fetchUserProfile } from './api';
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

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const checkAuthentication = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const profileData = await fetchUserProfile();
        setUserProfile(profileData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

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
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <PurchasesPage />
              </PrivateRoute>
            }
          />
          <Route
            path='shops/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <ShopsPage />
              </PrivateRoute>
            }
          />
          <Route
            path='products/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <ProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path='categories/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <CategoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path='currencies/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <CurrenciesPage />
              </PrivateRoute>
            }
          />
          <Route
            path='measures/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <MeasuresPage />
              </PrivateRoute>
            }
          />
          <Route
            path='moderation/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <ModerationPage />
              </PrivateRoute>
            }
          />
          <Route
            path='users/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <UsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path='roles/*'
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                setAuthModalOpen={setAuthModalOpen}
              >
                <RolesPage />
              </PrivateRoute>
            }
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
