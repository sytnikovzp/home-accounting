import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import useAuthentication from '@/src/hooks/useAuthentication';

import Layout from '@/src/components/Layout';
import PrivateRoute from '@/src/components/PrivateRoute';
import PublicRoute from '@/src/components/PublicRoute';
import SplashScreen from '@/src/components/SplashScreen';

import AboutPage from '@/src/pages/About';
import AuthPage from '@/src/pages/Auth';
import CategoriesPage from '@/src/pages/Categories';
import ContactsPage from '@/src/pages/Contacts';
import CurrenciesPage from '@/src/pages/Currencies';
import EstablishmentsPage from '@/src/pages/Establishments';
import ExpensesPage from '@/src/pages/Expenses';
import ForbiddenPage from '@/src/pages/Forbidden';
import HomePage from '@/src/pages/Home';
import MeasuresPage from '@/src/pages/Measures';
import ModerationPage from '@/src/pages/Moderation';
import NotFoundPage from '@/src/pages/NotFound';
import NotificationPage from '@/src/pages/Notification';
import ProductsPage from '@/src/pages/Products';
import ResetPasswordPage from '@/src/pages/ResetPassword';
import RolesPage from '@/src/pages/Roles';
import RoleViewPage from '@/src/pages/Roles/RoleViewPage';
import StatisticsPage from '@/src/pages/Statistics';
import UsersPage from '@/src/pages/Users';
import UserChangePasswordPage from '@/src/pages/Users/UserChangePasswordPage';
import UserEditPage from '@/src/pages/Users/UserEditPage';
import UserRemovePage from '@/src/pages/Users/UserRemovePage';
import UserViewPage from '@/src/pages/Users/UserViewPage';

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
  const { isFetching } = useAuthentication();

  if (isFetching) {
    return null;
  }

  return (
    <HelmetProvider>
      <SplashScreen />
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
