import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import useAuthUser from './hooks/useAuthUser';

import Layout from './components/Layout/Layout';
import ModalWindow from './components/ModalWindow/ModalWindow';
import Preloader from './components/Preloader/Preloader';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';

import AboutPage from './pages/About/AboutPage';
import AuthPage from './pages/Auth/AuthPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import ContactsPage from './pages/Contacts/ContactsPage';
import CurrenciesPage from './pages/Currencies/CurrenciesPage';
import EstablishmentsPage from './pages/Establishments/EstablishmentsPage';
import ExpensesPage from './pages/Expenses/ExpensesPage';
import ForbiddenPage from './pages/Forbidden/ForbiddenPage';
import HomePage from './pages/Home/HomePage';
import MeasuresPage from './pages/Measures/MeasuresPage';
import ModerationPage from './pages/Moderation/ModerationPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import NotificationPage from './pages/Notification/NotificationPage';
import ProductsPage from './pages/Products/ProductsPage';
import RolesPage from './pages/Roles/RolesPage';
import RoleViewPage from './pages/Roles/RoleViewPage';
import StatisticsPage from './pages/Statistics/StatisticsPage';
import UserChangePasswordPage from './pages/Users/UserChangePasswordPage';
import UserEditPage from './pages/Users/UserEditPage';
import UserRemovePage from './pages/Users/UserRemovePage';
import UsersPage from './pages/Users/UsersPage';
import UserViewPage from './pages/Users/UserViewPage';

const publicRoutes = [
  { path: 'auth', element: AuthPage },
  { path: 'redirect', element: ResetPasswordPage },
  { path: 'about', element: AboutPage },
  { path: 'contacts', element: ContactsPage },
];

const privateRoutes = [
  {
    path: 'expenses/*',
    element: ExpensesPage,
    permissions: [
      { entity: 'expenses', action: 'add' },
      { entity: 'expenses', action: 'edit' },
      { entity: 'expenses', action: 'remove' },
    ],
  },
  {
    path: 'establishments/*',
    element: EstablishmentsPage,
    permissions: [
      { entity: 'establishments', action: 'add' },
      { entity: 'establishments', action: 'edit' },
      { entity: 'establishments', action: 'remove' },
    ],
  },
  {
    path: 'products/*',
    element: ProductsPage,
    permissions: [
      { entity: 'products', action: 'add' },
      { entity: 'products', action: 'edit' },
      { entity: 'products', action: 'remove' },
    ],
  },
  {
    path: 'categories/*',
    element: CategoriesPage,
    permissions: [
      { entity: 'categories', action: 'add' },
      { entity: 'categories', action: 'edit' },
      { entity: 'categories', action: 'remove' },
    ],
  },
  {
    path: 'currencies/*',
    element: CurrenciesPage,
    permissions: [
      { entity: 'currencies', action: 'add' },
      { entity: 'currencies', action: 'edit' },
      { entity: 'currencies', action: 'remove' },
    ],
  },
  {
    path: 'measures/*',
    element: MeasuresPage,
    permissions: [
      { entity: 'measures', action: 'add' },
      { entity: 'measures', action: 'edit' },
      { entity: 'measures', action: 'remove' },
    ],
  },
  {
    path: 'moderation/*',
    element: ModerationPage,
    permissions: [
      { entity: 'moderation', action: 'category' },
      { entity: 'moderation', action: 'product' },
      { entity: 'moderation', action: 'establishment' },
    ],
  },
  {
    path: 'users/*',
    element: UsersPage,
    permissions: [
      { entity: 'users', action: 'fullView' },
      { entity: 'users', action: 'limitedView' },
      { entity: 'users', action: 'edit' },
      { entity: 'users', action: 'remove' },
    ],
  },
  {
    path: 'roles/*',
    element: RolesPage,
    permissions: [
      { entity: 'roles', action: 'add' },
      { entity: 'roles', action: 'edit' },
      { entity: 'roles', action: 'remove' },
    ],
  },
  { path: 'forbidden', element: ForbiddenPage },
  { path: 'profile', element: UserViewPage },
  { path: 'edit-profile', element: UserEditPage },
  { path: 'permissions', element: RoleViewPage },
  { path: 'password', element: UserChangePasswordPage },
  { path: 'remove-profile', element: UserRemovePage },
];

function App() {
  const { isFetchingUser } = useAuthUser();

  if (isFetchingUser) {
    return (
      <ModalWindow hideCloseIcon isOpen>
        <Preloader message='Welcome to Home Accounting...' />
      </ModalWindow>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route element={<Layout />} path='/'>
            <Route index element={<HomePage />} />
            {publicRoutes.map(({ path, element: Component }) => (
              <Route
                key={path}
                element={
                  <PublicRoute>
                    <Component />
                  </PublicRoute>
                }
                path={path}
              />
            ))}
            {privateRoutes.map(({ path, element: Component, permissions }) => (
              <Route
                key={path}
                element={
                  <PrivateRoute requiredPermissions={permissions}>
                    <Component />
                  </PrivateRoute>
                }
                path={path}
              />
            ))}
            <Route element={<StatisticsPage />} path='statistics' />
            <Route element={<NotificationPage />} path='notification' />
            <Route element={<NotFoundPage />} path='*' />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
