import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Layout from './components/Layout/Layout';
import ModalWindow from './components/ModalWindow/ModalWindow';
import Preloader from './components/Preloader/Preloader';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import AuthPage from './pages/Auth/AuthPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import CurrenciesPage from './pages/Currencies/CurrenciesPage';
import EstablishmentsPage from './pages/Establishments/EstablishmentsPage';
import ExpensesPage from './pages/Expenses/ExpensesPage';
import HomePage from './pages/Home/HomePage';
import MeasuresPage from './pages/Measures/MeasuresPage';
import ModerationPage from './pages/Moderation/ModerationPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ProductsPage from './pages/Products/ProductsPage';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';
import RolesPage from './pages/Roles/RolesPage';
import UsersPage from './pages/Users/UsersPage';

function App() {
  // if (isLoading) {
  //   return (
  //     <ModalWindow
  //       disableBackdropClick
  //       disableCloseButton
  //       isOpen
  //       content={<Preloader message='Welcome to Home Accounting...' />}
  //     />
  //   );
  // }

  const renderPrivateRoute = (Component) => (
    <PrivateRoute>{Component}</PrivateRoute>
  );

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route element={<Layout />} path='/'>
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
              element={renderPrivateRoute(<ModerationPage />)}
              path='moderation/*'
            />
            <Route element={renderPrivateRoute(<UsersPage />)} path='users/*' />
            <Route element={renderPrivateRoute(<RolesPage />)} path='roles/*' />
            <Route element={<NotificationsPage />} path='notification' />
            <Route element={<ResetPasswordPage />} path='reset-password' />
            <Route
              element={
                // isAuthenticated ? <Navigate replace to='/' /> :
                <AuthPage />
              }
              path='auth/*'
            />
            <Route element={<Navigate replace to='/' />} path='*' />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
