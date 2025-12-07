import { Route } from '@tanstack/react-router';
import { appLayoutRoute } from './app-layout-route';
import AccountSettings from '@/pages/AccountSettingPage';

export const accountSettingsRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: '/account-settings',
  component: AccountSettings,
});
