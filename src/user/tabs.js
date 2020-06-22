import { FreeIpaAccount } from '@waldur/freeipa/FreeIPAAccount';

import { HooksList } from './hooks/HooksList';
import { KeysList } from './keys/KeysList';
import { CurrentUserEvents } from './list/CurrentUserEvents';
import { UserDashboard } from './list/UserDashboard';
import { UserManage } from './UserManage';

export const tabs = {
  dashboard: {
    url: '',
    component: UserDashboard,
    data: {
      hideBreadcrumbs: true,
    },
  },
  events: {
    url: 'events/',
    component: CurrentUserEvents,
  },
  keys: {
    url: 'keys/',
    component: KeysList,
  },
  notifications: {
    url: 'notifications/',
    component: HooksList,
  },
  manage: {
    url: 'manage/',
    component: UserManage,
  },
  freeipa: {
    url: 'freeipa-account/',
    component: FreeIpaAccount,
    data: {
      feature: 'freeipa',
    },
  },
};

// @ngInject
export function requireIdParam($stateParams, $q) {
  // Abort state transition if mandatory route parameter (UUID) is not specified
  if (!$stateParams.uuid) {
    return $q.reject('UUID is mandatory parameter');
  }
}
