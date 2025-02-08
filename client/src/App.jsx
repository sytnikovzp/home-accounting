import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import useAuthUser from './hooks/useAuthUser';

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
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ProductsPage from './pages/Products/ProductsPage';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';
import RolesPage from './pages/Roles/RolesPage';
import RoleViewPage from './pages/Roles/RoleViewPage';
import UserChangePasswordPage from './pages/Users/UserChangePasswordPage';
import UserEditPage from './pages/Users/UserEditPage';
import UserRemovePage from './pages/Users/UserRemovePage';
import UsersPage from './pages/Users/UsersPage';
import UserViewPage from './pages/Users/UserViewPage';

const privateRoutes = [
  { path: 'expenses/*', element: ExpensesPage },
  { path: 'establishments/*', element: EstablishmentsPage },
  { path: 'products/*', element: ProductsPage },
  { path: 'categories/*', element: CategoriesPage },
  { path: 'currencies/*', element: CurrenciesPage },
  { path: 'measures/*', element: MeasuresPage },
  { path: 'moderation/*', element: ModerationPage },
  { path: 'users/*', element: UsersPage },
  { path: 'roles/*', element: RolesPage },
  { path: 'profile', element: UserViewPage },
  { path: 'edit-profile', element: UserEditPage },
  { path: 'permissions', element: RoleViewPage },
  { path: 'password', element: UserChangePasswordPage },
  { path: 'remove-profile', element: UserRemovePage },
];

function App() {
  const { isAuthenticated, isFetchingUser } = useAuthUser();

  if (isFetchingUser) {
    return (
      <ModalWindow
        disableBackdropClick
        disableCloseButton
        isOpen
        content={<Preloader message='Welcome to Home Accounting...' />}
      />
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route element={<Layout />} path='/'>
            <Route index element={<HomePage />} />
            {privateRoutes.map(({ path, element: Component }) => (
              <Route
                key={path}
                element={
                  <PrivateRoute>
                    <Component />
                  </PrivateRoute>
                }
                path={path}
              />
            ))}
            <Route element={<NotificationsPage />} path='notification' />
            <Route element={<ResetPasswordPage />} path='reset-password' />
            <Route
              element={
                isAuthenticated ? <Navigate replace to='/' /> : <AuthPage />
              }
              path='auth/*'
            />
            <Route element={<NotFoundPage />} path='*' />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
