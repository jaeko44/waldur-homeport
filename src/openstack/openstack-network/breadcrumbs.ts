import { getUUID } from '@waldur/core/utils';
import { gettext } from '@waldur/i18n';
import { ResourceBreadcrumbsRegistry } from '@waldur/resource/breadcrumbs/ResourceBreadcrumbsRegistry';

import { getTenantListState } from '../utils';

ResourceBreadcrumbsRegistry.register('OpenStack.Network', resource => {
  const tenant_uuid = getUUID(resource.tenant);
  return [
    getTenantListState(resource.project_uuid),
    {
      label: resource.tenant_name,
      state: 'resources.details',
      params: {
        uuid: tenant_uuid,
        resource_type: 'OpenStack.Tenant',
      },
    },
    {
      label: gettext('Networks'),
      state: 'resources.details',
      params: {
        uuid: tenant_uuid,
        resource_type: 'OpenStack.Tenant',
        tab: 'networks',
      },
    },
  ];
});