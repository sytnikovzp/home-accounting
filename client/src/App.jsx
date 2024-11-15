/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// ==============================================================
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route
            index
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <HomePage
                  setIsAuthenticated={setIsAuthenticated}
                  isAuthenticated={isAuthenticated}
                />
              </PrivateRoute>
            }
          />
          <Route
            path='auth/*'
            element={
              isAuthenticated ? (
                <Navigate to='/' replace />
              ) : (
                <AuthPage setIsAuthenticated={setIsAuthenticated} />
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
