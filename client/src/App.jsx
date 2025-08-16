import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import useAuthentication from '@/src/hooks/useAuthentication';

import Layout from '@/src/components/Layout/Layout';
import PrivateRoute from '@/src/components/PrivateRoute/PrivateRoute';
import PublicRoute from '@/src/components/PublicRoute/PublicRoute';
import SplashScreen from '@/src/components/SplashScreen/SplashScreen';

import AboutPage from '@/src/pages/About/AboutPage';
import AuthPage from '@/src/pages/Auth/AuthPage';
import ResetPasswordPage from '@/src/pages/Auth/ResetPasswordPage';
import CategoriesPage from '@/src/pages/Categories/CategoriesPage';
import ContactsPage from '@/src/pages/Contacts/ContactsPage';
import CurrenciesPage from '@/src/pages/Currencies/CurrenciesPage';
import EstablishmentsPage from '@/src/pages/Establishments/EstablishmentsPage';
import ExpensesPage from '@/src/pages/Expenses/ExpensesPage';
import ForbiddenPage from '@/src/pages/Forbidden/ForbiddenPage';
import HomePage from '@/src/pages/Home/HomePage';
import MeasuresPage from '@/src/pages/Measures/MeasuresPage';
import ModerationPage from '@/src/pages/Moderation/ModerationPage';
import NotFoundPage from '@/src/pages/NotFound/NotFoundPage';
import NotificationPage from '@/src/pages/Notification/NotificationPage';
import ProductsPage from '@/src/pages/Products/ProductsPage';
import RolesPage from '@/src/pages/Roles/RolesPage';
import RoleViewPage from '@/src/pages/Roles/RoleViewPage';
import StatisticsPage from '@/src/pages/Statistics/StatisticsPage';
import UserChangePasswordPage from '@/src/pages/Users/UserChangePasswordPage';
import UserEditPage from '@/src/pages/Users/UserEditPage';
import UserRemovePage from '@/src/pages/Users/UserRemovePage';
import UsersPage from '@/src/pages/Users/UsersPage';
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
